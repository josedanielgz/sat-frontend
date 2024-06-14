import { Action } from '@ngrx/store';
import { Activity } from 'src/app/model/activity';

export const LOAD_ACTIVITIES = '[ACTIVITY] Cargar activities';
export const LOAD_ACTIVITY = '[ACTIVITY] Cargar activity';
export const REMOVE_ACTIVITY = '[ACTIVITY] Limpiar activity';
export const LOADING_ACTIVITY = '[ACTIVITY] Cargando activity';
export const UNSET_LOADING_ACTIVITY = '[ACTIVITY] Desactivar carga activity';
export const DELETE_ACTIVITY = '[ACTIVITY] Eliminar activity';
export const SET_ACTIVE = '[ACTIVITY] Activar Activity';
export const UNSET_ACTIVE = '[ACTIVITY] Desactivar Activity';
export const UPDATE_ACTIVE = '[ACTIVITY] Actualizar Activity';

export class loandActivitiesAction implements Action {
  readonly type = LOAD_ACTIVITIES;
  constructor(public payload: Activity[]) {}
}

export class loandActivityAction implements Action {
  readonly type = LOAD_ACTIVITY;
  constructor(public payload: Activity) {}
}

export class removerActivityAction implements Action {
  readonly type = REMOVE_ACTIVITY;
  constructor() {}
}

export class LoadingActivityAction implements Action {
  readonly type = LOADING_ACTIVITY;
  constructor(public payload: any) {}
}

export class UnsetLoadingActivityAction implements Action {
  readonly type = UNSET_LOADING_ACTIVITY;
  constructor(public payload: any) {}
}

export class DeleteActivityAction implements Action {
  readonly type = DELETE_ACTIVITY;
  constructor(public payload: any) {}
}

export class SetActiveAction implements Action {
  readonly type = SET_ACTIVE;
  constructor(public payload: Activity) {}
}

export class UnsetActiveAction implements Action {
  readonly type = UNSET_ACTIVE;
  constructor() {}
}

export class UpdateActivityAction implements Action {
  readonly type = UPDATE_ACTIVE;
  constructor(public payload: any) {}
}

export type actions =
  | loandActivitiesAction
  | loandActivityAction
  | removerActivityAction
  | LoadingActivityAction
  | DeleteActivityAction
  | SetActiveAction
  | UnsetActiveAction
  | UpdateActivityAction
  | UnsetLoadingActivityAction;
