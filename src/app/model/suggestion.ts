import { User } from './auth';
import { Profit } from './risk';

export interface Suggestion {
  _id?: any;
  codeStudent: String;
  profit: any;
  date: Date | String;
  admin?: any;
  state?: Boolean;
  response?: Boolean;
  select?: Boolean;
}
export interface SuggestionItem {
  admin: User;
  date: any;
  profit: Profit;
  select?: Boolean;
  student: User;
  _id: String;
}
export interface ResponseSuggestionPaginate {
  data: SuggestionItem[];
  totalPages: number;
}

export interface ResponseSuggestion {
  data: [];
  msg: String;
  ok: Boolean;
}
