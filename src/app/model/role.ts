export interface Role {
  _id: any;
  role: String;
}

export interface RoleResponse {
  msg: String;
  ok: Boolean;
  data: Role;
}

export interface RoleSchedule {
  role: String;
  schedule: Schedule;
}

export interface Schedule {
  _id?: any;
  role?: any;
  morningStart: String;
  morningEnd: String;
  afternoonStart: String;
  afternoonEnd: String;
}

export interface ScheduleResponse {
  ok: Boolean;
  data: {
    schedule: Schedule;
    reservations: String[];
  };
  msg: String;
}
