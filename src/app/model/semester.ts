export interface InfoSemester {
  estado: String;
  fecha: String;
  promedio: String;
}

export interface Semester {
  data: InfoSemester[];
  registered: Number;
}

export interface ResponseSemester {
  ok: Boolean;
  msg: String;
  data: Semester;
}

export interface SemesterBoss {
  nombre: String;
  cursos: CourseSemester[];
}

export interface CourseSemester {
  codigo: String;
  nombre: String;
  showGroup: Boolean;
  loading: Boolean;
  grupos: GroupCourse[];
}

export interface GroupCourse {
  apellidodocente: String;
  nombredocente: String;
  correodocente: String;
  codigodocente: String;
  grupo: String;
  creditos: String;
  codigo: String;
  nombre: String;
  num_alum_matriculados: String;
  num_max_alumnos: String;
}
