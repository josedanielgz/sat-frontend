import * as fromAuth from './auth.actions';
import { User } from 'src/app/model/auth';

export interface AuthState {
  user: User;
}

const initState: AuthState = {
  user: null,
};

export const authReducer = (
  state = initState,
  actions: fromAuth.actions
): AuthState => {
  switch (actions.type) {
    case fromAuth.ADD_USER:
      return {
        ...state,
        user: actions.user,
      };

    case fromAuth.REMOVE_USER:
      return {
        ...state,
        user: null,
      };

    case fromAuth.UPDATE_PHOTO:
      return {
        ...state,
        user: { ...state.user, foto: actions.payload },
      };

    default:
      return {
        ...state,
      };
  }
};
