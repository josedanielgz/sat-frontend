import { Action } from '@ngrx/store';
import { Course } from 'src/app/model/course';

export const LOADING_COURSES = '[COURSE] Loading Course';
export const DELETE_COURSES = '[COURSE] Delete Course';
export const ACTIVE_COURSE = '[COURSE] Active Course';
export const DESACTIVE_COURSE = '[COURSE] Desactive Course';
export const LOAD_STUDENTS = '[COURSE] Load Students';
export const FILTER_STUDENTS = '[COURSE] Filter Students';
export const DELETE_STUDENTS = '[COURSE] DELETE Students';

export class LoadingCourseAction implements Action {
  readonly type = LOADING_COURSES;
  constructor(public payload: Course[]) {}
}

export class DeleteCourseAction implements Action {
  readonly type = DELETE_COURSES;
  constructor() {}
}

export class ActiveCourseAction implements Action {
  readonly type = ACTIVE_COURSE;
  constructor(public payload: String) {}
}

export class DesactiveCourseAction implements Action {
  readonly type = DESACTIVE_COURSE;
  constructor() {}
}

export class LoadStudentsAction implements Action {
  readonly type = LOAD_STUDENTS;
  constructor(public payload: any) {}
}

export class FilterStudentsAction implements Action {
  readonly type = FILTER_STUDENTS;
  constructor(public payload: any) {}
}

export class DeleteStudentsAction implements Action {
  readonly type = DELETE_STUDENTS;
  constructor() {}
}

export type actions =
  | LoadingCourseAction
  | DeleteCourseAction
  | ActiveCourseAction
  | DesactiveCourseAction
  | LoadStudentsAction
  | DeleteStudentsAction
  | FilterStudentsAction;
