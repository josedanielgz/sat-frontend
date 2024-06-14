export interface User {
  _id: String;
  foto?: String;
  codigo?: String;
  documento: String;
  nombre: String;
  apellido: String;
  sexo?: String;
  correo: String;
  rol: string;
  tipodocument?: String;
  programa?: String;
  telefono: String;
  direccion?: String;
  estado?: string;
  fechaingreso?: any;
  creditosaprobados?: Number;
  edad?: Number;
  ac012: Boolean;
  creditostotales?: Number;
  semestre?: Number;
  promedio?: Number;
  promedioponderadoacomulado?: Number;
  riesgo?: number;
}

export interface UserAuth {
  code?: String;
  document: String;
  password: String;
  role?: String;
}

export interface AuthResponse {
  data: User;
  msg: String;
  token: String;
  ok: Boolean;
}

export interface UserResponse {
  msg: String;
  ok: Boolean;
  data: User;
}

export interface StudentResponse {
  msg: String;
  ok: Boolean;
  data: User[];
}
