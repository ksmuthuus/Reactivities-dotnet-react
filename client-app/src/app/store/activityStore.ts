import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../model/Activity";
import agent from "../api/agent";

configure({ enforceActions: "always" });

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | undefined;
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable submitting = false;
  @observable target = "";

  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction("loadActivities", () => {
        activities.forEach(activity => {
          activity.date = activity.date.split(".")[0];
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      console.log(error);
      runInAction("loadActivities error", () => {
        this.loadingInitial = false;
      });
    }
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction("createActivity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
        this.editMode = false;
        this.selectedActivity = activity;
      });
    } catch (error) {
      console.log(error);
      runInAction("createActivity error", () => {
        this.submitting = false;
      });
    }
  };
  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction("editActivity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.editMode = false;
        this.submitting = false;
        this.selectedActivity = activity;
      });
    } catch (error) {
      console.log(error);
      runInAction("editActivity error", () => {
        this.editMode = false;
        this.submitting = false;
      });
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction("deleteActivity", () => {
        if (this.selectedActivity && this.selectedActivity.id === id) {
          this.selectedActivity = undefined;
        }
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = "";
      });
    } catch (error) {
      console.log(error);
      runInAction("deleteActivity error", () => {
        this.submitting = false;
        this.target = "";
      });
    }
  };

  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  };
  @action openEditForm = (id: string) => {
    this.editMode = true;
    this.selectedActivity = this.activityRegistry.get(id);
  };
  @action cancelOpenForm = () => {
    this.editMode = false;
    this.selectedActivity = undefined;
  };

  @action selectActivity = (id: string) => {
    this.editMode = false;
    this.selectedActivity = this.activityRegistry.get(id);
  };
}

export default createContext(new ActivityStore());
