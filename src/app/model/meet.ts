export interface Meet {
  _id: any;
  student: {
    nombre: String;
    correo: String;
    codigo: String;
  };
  postulation: String;
  state: String;
  ubication: String;
  date: Date;
  reason?: String;
  hour: String;
  role: String;
  dateFormat: String;
  attendance: Boolean;
}

export interface MeetResponse {
  ok: Boolean;
  data: Meet;
  msg: String;
}

export interface MeetAsistenResponse {
  data: {};
  msg: String;
  ok: Boolean;
}

export interface MeetPaginateResponse {
  totalPages: Number;
  data: Meet[];
}

export interface FilterMeet {
  show: Boolean;
  state?: string;
  date?: string;
}

export interface Reason {
  name: String;
  isActive: Boolean;
}
