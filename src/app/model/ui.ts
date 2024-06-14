import { Student } from './course';

export interface Title {
  title: String;
  subtitle?: String;
}

export interface ItemRisk {
  icon: String;
  urlImg: String;
  items: String[];
}

export interface StudentInDanger {
  student: Student;
  date: Date;
  postulatorRole: String;
}

export interface ServicesWellness {
  num: number;
  name: String;
  isActive: boolean;
}
export interface ServicesWellnessRe {
  num: number;
  name: String;
  option: String;
}

export interface MenuOptions {
  path: String;
  icon: String;
  name: String;
  isAllowed: (role: String) => boolean;
}

export interface Note {
  note: Number;
  name: String;
  color: String;
}

//Couser con Asistencia
export interface desCourse {
  name: String;
  group: String;
  assistance: number;
}
