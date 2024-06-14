import { User } from './auth';

export interface Risk {
  name: String;
  path: String;
  riskGlobal: number;
  icon: String;
  color: Function;
}

export interface Postulation {
  _id?: any;
  student: User;
  postulator: User;
  date: Date;
  description: String;
  state?: String;
  isActive: boolean;
}

export interface PostulationResponse {
  data: Postulation[];
  totalPages: number;
}
export interface ResposeUpdatePostulation {
  data?: null;
  msg: String;
  ok: Boolean;
}
export interface ResposeCounterPostulation {
  data: Number;
  msg: String;
  ok: Boolean;
}
export interface ResposeStudentPostulation {
  data: Postulation;
  msg: String;
  ok: Boolean;
}

export interface Profit {
  fechaFinal?: Date;
  fechaInicio: Date;
  nombre: String;
  descripcion: String;
  semestre: Number;
  riesgo?: String;
}

export interface ProfitResponse {
  data: Profit[];
  msg: String;
  ok: boolean;
}

export interface RiskUFPS {
  nombre: String;
  puntaje: number;
  items: ItemRisk[];
}

export interface ItemRisk {
  nombre: String;
  valor: number;
}

export interface RiskResponse {
  riesgos: RiskUFPS[];
  riesgoGlobal: number;
}

export interface StatisticsRisk {
  risk: String;
  code?: String;
  group?: String;
  program?: String;
  period?: String;
  global?: Boolean;
}

export interface Statistics {
  type: String;
  total: number;
  counter?: number;
}

export interface StatisticsResponse {
  ok: Boolean;
  data?: Statistics[];
  msg: String;
}

export interface StudentsInRiskResponse {
  ok: Boolean;
  data?: User[];
  msg: String;
}
