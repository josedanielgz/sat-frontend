import { User } from 'src/app/model/auth';
import * as fromUI from './ui.actions';

export interface UIState {
  loading: boolean;
  titleNavbar: String;
  error: String;
  path: String;
  userActive: User;
}

const initState: UIState = {
  loading: false,
  titleNavbar: 'SAT',
  error: '',
  path: '',
  userActive: null,
};

export const uiReducer = (
  state = initState,
  actions: fromUI.actions
): UIState => {
  switch (actions.type) {
    case fromUI.START_LOADING:
      return {
        ...state,
        loading: true,
      };

    case fromUI.FINISH_LOADING:
      return {
        ...state,
        loading: false,
      };

    case fromUI.SET_TITLE_NAVBAR:
      return {
        ...state,
        titleNavbar: actions.payload,
      };
    case fromUI.SET_USER_ACTIVE:
      return {
        ...state,
        userActive: actions.payload,
      };
    case fromUI.UNSET_USER_ACTIVE:
      return {
        ...state,
        userActive: null,
      };
    case fromUI.SET_ERROR:
      return {
        ...state,
        error: actions.message,
        path: actions.path,
      };

    default:
      return state;
  }
};
