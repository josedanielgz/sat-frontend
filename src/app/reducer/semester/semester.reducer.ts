import { GroupCourse, SemesterBoss } from 'src/app/model/semester';
import * as fromSemester from './semester.actions';

export interface SemesterState {
  semesters: SemesterBoss[];
  active: GroupCourse;
}

const initState: SemesterState = {
  semesters: [],
  active: null,
};

export const semesterReducer = (
  state = initState,
  actions: fromSemester.actions
): SemesterState => {
  switch (actions.type) {
    case fromSemester.LOAD_SEMESTER:
      return { ...state, semesters: [...actions.payload] };
    case fromSemester.CLEAN_SEMESTER:
      return { ...initState };
    case fromSemester.SET_COURSES:
      return {
        ...state,
        semesters: state.semesters.map((x, i) =>
          i + 1 === actions.semester ? { ...x, cursos: actions.payload } : x
        ),
      };
    case fromSemester.SET_GROUPS:
      return {
        ...state,
        semesters: state.semesters.map((x, i) =>
          i === actions.semester
            ? {
                ...x,
                cursos: x.cursos.map((y, i) =>
                  i === actions.course ? { ...y, grupos: actions.payload } : y
                ),
              }
            : x
        ),
      };
    case fromSemester.SET_LOADING:
      return {
        ...state,
        semesters: state.semesters.map((x, i) =>
          i === actions.semester
            ? {
                ...x,
                cursos: x.cursos.map((y, i) =>
                  i === actions.course ? { ...y, loading: true } : y
                ),
              }
            : x
        ),
      };
    case fromSemester.UNSET_LOADING:
      return {
        ...state,
        semesters: state.semesters.map((x, i) =>
          i === actions.semester
            ? {
                ...x,
                cursos: x.cursos.map((y, i) =>
                  i === actions.course ? { ...y, loading: false } : y
                ),
              }
            : x
        ),
      };
    case fromSemester.SET_ACTIVE:
      return { ...state, active: { ...actions.payload } };

    default:
      return state;
  }
};
