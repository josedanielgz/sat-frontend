import { Action } from '@ngrx/store';
import { ResponseNotification } from 'src/app/model/notification';

export const LOADING_NOTIFICATION = '[NOTIFICATION] Loading notification';
export const DELETE_NOTIFICATIONS = '[NOTIFICATION] Delete notifications';
export const DELETE_NOTIFICATION = '[NOTIFICATION] Delete notification';
export const UPDATE_NOTIFICATION = '[NOTIFICATION] Update Notification';
export const UPDATE_COUNTER = '[NOTIFICATION] Update Counter';

export class LoadingNotificationAction implements Action {
  readonly type = LOADING_NOTIFICATION;
  constructor(public payload: ResponseNotification[]) {}
}

export class DeleteNotificationsAction implements Action {
  readonly type = DELETE_NOTIFICATIONS;
  constructor() {}
}

export class DeleteNotificationAction implements Action {
  readonly type = DELETE_NOTIFICATION;
  constructor(public payload: String) {}
}

export class UpdateNotificationAction implements Action {
  readonly type = UPDATE_NOTIFICATION;
  constructor(public payload: String) {}
}

export class UpdateCounterAction implements Action {
  readonly type = UPDATE_COUNTER;
  constructor(public payload?: Number) {}
}

export type actions =
  | LoadingNotificationAction
  | DeleteNotificationsAction
  | DeleteNotificationAction
  | UpdateNotificationAction
  | UpdateCounterAction;
