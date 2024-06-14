import { Activity } from 'src/app/model/activity';
import * as fromActivity from './activity.action';

export interface ActivityState {
  activities: Activity[];
  active: Activity;
}

const initState: ActivityState = {
  activities: [],
  active: null,
};

export const activityReducer = (
  state = initState,
  action: fromActivity.actions
): ActivityState => {
  switch (action.type) {
    case fromActivity.LOAD_ACTIVITY:
      return {
        ...state,
        activities: [{ ...action.payload, counter: 0 }, ...state.activities],
      };

    case fromActivity.LOAD_ACTIVITIES:
      return { ...state, activities: [...action.payload] };

    case fromActivity.REMOVE_ACTIVITY:
      return { ...initState };

    case fromActivity.LOADING_ACTIVITY:
      return {
        ...state,
        activities: state.activities.map((x) =>
          x._id.$oid === action.payload ? { ...x, loading: true } : x
        ),
      };

    case fromActivity.UNSET_LOADING_ACTIVITY:
      return {
        ...state,
        activities: state.activities.map((x) =>
          x._id.$oid === action.payload ? { ...x, loading: false } : x
        ),
      };

    case fromActivity.DELETE_ACTIVITY:
      return {
        ...state,
        activities: state.activities.filter(
          (x) => x._id.$oid !== action.payload
        ),
      };

    case fromActivity.SET_ACTIVE:
      return {
        ...state,
        active: { ...action.payload },
      };

    case fromActivity.UNSET_ACTIVE:
      return {
        ...state,
        active: null,
      };

    case fromActivity.UPDATE_ACTIVE:
      return {
        ...state,
        activities: state.activities.map((x) =>
          x._id.$oid === action.payload.id
            ? { ...x, ...action.payload.activity }
            : x
        ),
      };

    default:
      return { ...state };
  }
};
