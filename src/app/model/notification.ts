export interface ResponseNotification {
  _id?: any;
  title: String;
  date: Date;
  isActive: boolean;
  url: String;
  codeReceiver: String;
  codeTransmitter?: String;
  roleTransmitter?: String;
}
