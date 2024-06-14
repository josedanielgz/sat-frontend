import { Action } from '@ngrx/store';
import {
  CourseSemester,
  GroupCourse,
  SemesterBoss,
} from 'src/app/model/semester';

export const LOAD_SEMESTER = '[SEMESTER] Cargar semestres';
export const SET_COURSES = '[SEMESTER] Cargar cursos del semestre';
export const SET_GROUPS = '[SEMESTER] Cargar grupos del curso';
export const SET_ACTIVE = '[SEMESTER] Activar grupo';
export const CLEAN_SEMESTER = '[SEMESTER] Limpiar semestres';
export const SET_LOADING = '[SEMESTER] Iniciar cargando';
export const UNSET_LOADING = '[SEMESTER] Terminar cargando';

export class LoadSemesterAction implements Action {
  readonly type = LOAD_SEMESTER;
  constructor(public payload: SemesterBoss[]) {}
}

export class CleanSemesterAction implements Action {
  readonly type = CLEAN_SEMESTER;
  constructor() {}
}

export class SetCourseSemesterAction implements Action {
  readonly type = SET_COURSES;
  constructor(public payload: CourseSemester[], public semester: number) {}
}

export class SetGroupsSemesterAction implements Action {
  readonly type = SET_GROUPS;
  constructor(
    public payload: GroupCourse[],
    public course: number,
    public semester: number
  ) {}
}

export class SetActiveGroupAction implements Action {
  readonly type = SET_ACTIVE;
  constructor(public payload: GroupCourse) {}
}

export class SetLoadingAction implements Action {
  readonly type = SET_LOADING;
  constructor(public course: number, public semester: number) {}
}

export class UnsetLoadingAction implements Action {
  readonly type = UNSET_LOADING;
  constructor(public course: number, public semester: number) {}
}

export type actions =
  | LoadSemesterAction
  | CleanSemesterAction
  | SetCourseSemesterAction
  | SetGroupsSemesterAction
  | SetActiveGroupAction
  | SetLoadingAction
  | UnsetLoadingAction;
