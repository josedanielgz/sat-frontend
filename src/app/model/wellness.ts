export interface Facultie {
  nombre: String;
  programas: String[];
}

export interface ResponseFacultie {
  ok: Boolean;
  data: Facultie[];
  msg: String;
}
