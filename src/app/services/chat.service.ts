import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { AppState } from '../app.reducers';
import {
  getValueOfLocalStorage,
  saveInLocalStorage,
} from '../helpers/localStorage';
import { User } from '../model/auth';
import {
  ResponseChat,
  ResponseChatAdmin,
  ResponseSendMessage,
  ResponseSendMessageAdmin,
  UserChat,
  UsersChat,
} from '../model/chat';
import {
  AddMsgChatAction,
  LoadingChatAction,
} from '../reducer/Chat/chat.actions';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  url: String = environment.url_backend;

  userShow: User = null;

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  async getMessages(userShow: User) {
    try {
      this.userShow = userShow;
      saveInLocalStorage('receiver', userShow);
      const { codigo: code, nombre, apellido, correo: email } = userShow;
      const data = await this.http
        .post<ResponseChat[]>(this.url + '/chat/messages', {
          code,
          email,
          name: `${nombre} ${apellido}`,
        })
        .toPromise();
      this.store.dispatch(new LoadingChatAction(data));
      this.router.navigate(['/estudiante/chat'], {
        fragment: 'contenedor',
      });
    } catch (error) {
      console.error(error);
    }
  }

  async sendMessage(
    message: String,
    name: String,
    codeAuth: String,
    roleTransmitter: String,
    title?: String
  ) {
    try {
      const {
        codigo: code,
        nombre,
        apellido,
        correo: email,
      } = this.userShow || getValueOfLocalStorage('receiver');
      const data = {
        message,
        date: new Date().toISOString(),
        receiver: {
          code,
          email,
          name: `${nombre} ${apellido}`,
        },
      };
      const { data: chat } = await this.http
        .post<ResponseSendMessage>(this.url + '/chat/', data)
        .toPromise();
      this.store.dispatch(new AddMsgChatAction(chat));
      title = title ? title : `Ha recibido un mensaje de ${name}`;
      this.createNotification(
        code,
        codeAuth,
        roleTransmitter,
        title,
        '/estudiante/chat'
      );
    } catch (error) {
      console.error(error);
    }
  }

  createNotification(
    codeReceiver: String,
    codeTransmitter: String,
    roleTransmitter: String,
    title: String,
    url: String
  ) {
    const notification = {
      codeReceiver,
      codeTransmitter,
      roleTransmitter,
      date: new Date().toISOString(),
      title,
      url,
      isActive: true,
    };
    this.notificationService.sendNotification(notification);
  }

  getAdmins(role: String) {
    try {
      return this.http
        .get<UserChat[]>(this.url + '/chatAdmin/' + role)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  getAdmin(document: String) {
    try {
      return this.http
        .get<UserChat>(this.url + '/chatAdmin/admin/' + document)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async sendMessageChatAdmin(message: ResponseChatAdmin) {
    try {
      return this.http
        .post<ResponseSendMessageAdmin>(this.url + '/chatAdmin/', message)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async listChatAdmin(usersChat: UsersChat) {
    try {
      return this.http
        .post<ResponseChatAdmin[]>(this.url + '/chatAdmin/list', usersChat)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
