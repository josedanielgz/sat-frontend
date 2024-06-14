import { Action } from '@ngrx/store';
import { User } from 'src/app/model/auth';

export const START_LOADING = '[UI] Start Loading';
export const FINISH_LOADING = '[UI] Finish Loading';
export const SET_TITLE_NAVBAR = '[UI] Set Title Navbar';
export const SET_USER_ACTIVE = '[UI] Set User Active';
export const UNSET_USER_ACTIVE = '[UI] Unset User Active';
export const SET_ERROR = '[UI] Set Error ';

export class StartLoadingAction implements Action {
  readonly type = START_LOADING;
  constructor() {}
}

export class FinishLoadingAction implements Action {
  readonly type = FINISH_LOADING;
  constructor() {}
}

export class SetTitleNavbarAction implements Action {
  readonly type = SET_TITLE_NAVBAR;
  constructor(public payload: String) {}
}

export class SetUserActiveAction implements Action {
  readonly type = SET_USER_ACTIVE;
  constructor(public payload: User) {}
}

export class UnsetUserActiveAction implements Action {
  readonly type = UNSET_USER_ACTIVE;
  constructor() {}
}

export class SetError implements Action {
  readonly type = SET_ERROR;
  constructor(public message: String, public path: String) {}
}

export type actions =
  | StartLoadingAction
  | FinishLoadingAction
  | SetTitleNavbarAction
  | SetUserActiveAction
  | UnsetUserActiveAction
  | SetError;
