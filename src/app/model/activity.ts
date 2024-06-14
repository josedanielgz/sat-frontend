export interface Activity {
  _id: any;
  name: String;
  date: Date;
  place: String;
  risk: String;
  riskLevel: String;
  state: Boolean;
  description?: String;
  counter: number;
  asistance: Boolean;
  loading?: Boolean;
}
export interface ResponseActivity {
  data: Activity;
  ok: Boolean;
  msg: String;
}
