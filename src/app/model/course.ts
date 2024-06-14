export interface Course {
  grupo: String;
  previo_dos?: number;
  previo_tres?: number;
  previo_uno?: number;
  examen_final?: number;
  materia: Materia;
  docente: String;
}

export interface Materia {
  codigo: String;
  creditos: number;
  horario: String;
  nombre: String;
  semestre: number;
  ac012?: Boolean;
}

export interface ResponseCourse {
  ok: Boolean;
  data: Course[];
  msg: String;
}

export interface Student {
  id: number;
  names: String;
  surnames: String;
  code: String;
  risk: String;
}
