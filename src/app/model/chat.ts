export interface Talk {
  code: String;
  email: String;
  name: String;
}

export interface UserChat {
  nombre: String;
  apellido: String;
  documento: String;
  correo: String;
  foto?: String;
}

export interface UsersChat {
  transmitter: String;
  receiver: String;
}

export interface ResponseChat {
  _id?: any;
  message: String;
  date: Date;
  transmitter: Talk;
  receiver: Talk;
}

export interface ResponseChatAdmin {
  _id?: any;
  message: String;
  date: Date;
  transmitter: UserChat;
  receiver: UserChat;
}

export interface ResponseSendMessage {
  data: ResponseChat;
  message: String;
  ok: Boolean;
}

export interface ResponseSendMessageAdmin {
  data: ResponseChatAdmin;
  message: String;
  ok: Boolean;
}
