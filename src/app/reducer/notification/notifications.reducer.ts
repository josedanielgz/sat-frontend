import { ResponseNotification } from 'src/app/model/notification';
import * as fromNotification from './notification.actions';

export interface NotificationState {
  notification: ResponseNotification[];
  unread: Number;
  counter: Number;
}
const initState: NotificationState = {
  notification: [],
  unread: 0,
  counter: 0,
};

export const notificationReducer = (
  state = initState,
  actions: fromNotification.actions
): NotificationState => {
  switch (actions.type) {
    case fromNotification.LOADING_NOTIFICATION:
      return {
        ...state,
        notification: actions.payload,
        unread: actions.payload
          ? actions.payload.filter((notification) => notification.isActive)
              .length
          : 0,
      };
    case fromNotification.DELETE_NOTIFICATIONS:
      return {
        ...state,
        notification: [],
        unread: 0,
        counter: 0,
      };
    case fromNotification.DELETE_NOTIFICATION:
      return {
        ...state,
        notification: state.notification.filter(
          ({ _id }) => _id.$oid !== actions.payload
        ),
        unread: Number(state.unread) - 1,
      };

    case fromNotification.UPDATE_NOTIFICATION:
      return {
        ...state,
        notification: state.notification.map((notification) =>
          notification._id.$oid === actions.payload
            ? { ...notification, isActive: false }
            : { ...notification }
        ),
        unread: Number(state.unread) - 1,
      };
    default:
      return state;

    case fromNotification.UPDATE_COUNTER:
      return {
        ...state,
        counter: actions.payload
          ? actions.payload
          : state.counter > 0
          ? +state.counter - 1
          : state.counter,
      };
  }
};
