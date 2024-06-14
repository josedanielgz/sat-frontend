export interface Binnacle {
  _id?: any;
  student: String;
  role: string;
  date: any;
  text: String;
}

export interface ResponseBinnacle {
  ok: boolean;
  data: Binnacle;
  msg: String;
}
