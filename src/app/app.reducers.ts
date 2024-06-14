import { ActionReducerMap } from '@ngrx/store';
import * as fromUI from './reducer/ui/ui.reducer';
import * as fromAuth from './reducer/auth/auth.reducer';
import * as fromCourse from './reducer/course/course.reducer';
import * as fromChat from './reducer/Chat/chat.reducer';
import * as fromRisk from './reducer/risk/risk.reducer';
import * as fromNotification from './reducer/notification/notifications.reducer';
import * as fromRole from './reducer/role/role.reduce';
import * as fromActivity from './reducer/activity/activity.reduce';
import * as fromSemester from './reducer/semester/semester.reducer';

export interface AppState {
  ui: fromUI.UIState;
  auth: fromAuth.AuthState;
  course: fromCourse.CourseState;
  chat: fromChat.ChatState;
  notification: fromNotification.NotificationState;
  risk: fromRisk.RiskState;
  role: fromRole.RoleState;
  activity: fromActivity.ActivityState;
  semester: fromSemester.SemesterState;
}

export const combineReducer: ActionReducerMap<AppState> = {
  ui: fromUI.uiReducer,
  auth: fromAuth.authReducer,
  course: fromCourse.courseReducer,
  chat: fromChat.chatReducer,
  notification: fromNotification.notificationReducer,
  risk: fromRisk.riskReducer,
  role: fromRole.roleReduce,
  activity: fromActivity.activityReducer,
  semester: fromSemester.semesterReducer,
};
