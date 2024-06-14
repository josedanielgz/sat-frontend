import { Action } from '@ngrx/store';
import { Role } from 'src/app/model/role';

export const LOAD_ROLE = '[ROLE] Cargar roles';
export const REMOVE_ROLE = '[ROLE] Eliminar roles';
export const ADD_ROLE = '[ROLE] Agregar Rol';

export class LoadRoleAction implements Action {
  readonly type = LOAD_ROLE;
  constructor(public payload: Role[]) {}
}

export class RemoverRoleAction implements Action {
  readonly type = REMOVE_ROLE;
  constructor() {}
}

export class AddRoleAction implements Action {
  readonly type = ADD_ROLE;
  constructor(public payload: Role) {}
}

export type actions = LoadRoleAction | RemoverRoleAction | AddRoleAction;
