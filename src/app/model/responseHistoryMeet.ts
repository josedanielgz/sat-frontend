import { LocalizedString } from '@angular/compiler';
import { HistoryClinical, MeetClinical } from './meetClinical';
import { HistoryPsychology, MeetPsychology } from './meetPsychology';

export interface ResponseHistotyMett {
  meet: {
    date: String;
    hour: String;
  };
  dateFormat?: Date;
  meetPsychological?: MeetPsychology;
  meetClinical?: MeetClinical;
}
export interface ResponseRecordHistory {
  _id: any;
  familyHistory?: String;
  allergicToxic?: String;
  gynecological?: String;
  others?: String;
  pathological?: String;
  pharmacological?: String;
  student?: String;
  surgical?: String;
  traumatic?: String;
  venereal?: String;
}

export interface Record {
  familyHistory?: String;
  allergicToxic?: String;
  gynecological?: String;
  others?: String;
  pathological?: String;
  pharmacological?: String;
  surgical?: String;
  traumatic?: String;
  venereal?: String;
  _id: any;
  student: String;
}
export interface BodyMeetActivateRol {
  role: String;
  student: {
    codigo: String;
    correo: String;
    nombre: String;
  };
  typeHistory: String;
}
export interface ResponseMeetActivateRol {
  meet: {
    date: Date;
    hour: String;
    _id: any;
  };
  meetClinical?: {
    bloodPressure: String;
    breathingFrequency: number;
    generalIllness: String;
    heartRate: number;
    reasonConsultation: String;
    size: number;
    student: String;
    systemsReview: String;
    temperature: number;
    weight: number;
    meet: { $oid: String };
    _id: any;
  };
  meetPsychological?: {
    currentProblem: String;
    diagnosis: String;
    forecast: String;
    psychotherapeuticApproach: String;
    reasonMeet: String;
    student: String;
    meet: { $oid: String };
    _id: any;
  };
}
