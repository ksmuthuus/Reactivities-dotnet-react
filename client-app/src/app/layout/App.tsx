import React, { useState, useEffect, Fragment } from "react";
import { Container } from "semantic-ui-react";
import { IActivity } from "../model/Activity";
import NavBar from "../../features/nav/NavBar";
import { ActivityDashBoard } from "../../features/activity/dashboard/ActivityDashBoard";
import agent from "../api/agent";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCreateActivity = (activity: IActivity) => {
    agent.Activities.create(activity).then(() => {
      setActivities([...activities, activity]);
      setSelectedActivity(activity);
      setEditMode(false);
    });
  };

  const handleEditActivity = (activity: IActivity) => {
    agent.Activities.update(activity).then(() => {
      setActivities([
        ...activities.filter(a => a.id !== activity.id),
        activity
      ]);
      setSelectedActivity(activity);
      setEditMode(false);
    });
  };

  const handleDeleteActivity = (id: string) => {
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(a => a.id !== id)]);
      //If the deleted activity is current selected activity
      if (selectedActivity && selectedActivity.id === id) {
        setSelectedActivity(null);
      }
    });
  };

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
    setEditMode(false);
  };

  useEffect(() => {
    agent.Activities.list().then(response => {
      let activities: IActivity[] = [];
      response.forEach(activity => {
        activity.date = activity.date.split(".")[0];
        activities.push(activity);
      });
      setActivities(activities);
    });
  }, []);

  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashBoard
          activities={activities}
          selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
    </Fragment>
  );
};

export default App;
