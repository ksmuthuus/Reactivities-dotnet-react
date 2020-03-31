import React from "react";
import { Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/model/Activity";
import { ActivityList } from "./ActivityList";
import { ActivityDetails } from "../details/ActivityDetails";
import { ActivityForm } from "../form/ActivityForm";

interface IProps {
  activities: IActivity[];
  selectActivity: (id: string) => void;
  selectedActivity: IActivity | null;
}

export const ActivityDashBoard: React.FC<IProps> = ({
  activities,
  selectActivity,
  selectedActivity
}) => {
  return (
    <div>
      <Grid>
        <Grid.Column width={10}>
          <ActivityList
            activities={activities}
            selectActivity={selectActivity}
          />
        </Grid.Column>
        <Grid.Column width={6}>
          {selectedActivity && <ActivityDetails activity={selectedActivity} />}
          <ActivityForm />
        </Grid.Column>
      </Grid>
    </div>
  );
};
