import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { getValueOfLocalStorage } from 'src/app/helpers/localStorage';
import { ResponseChat } from 'src/app/model/chat';
import { DeleteChatAction } from 'src/app/reducer/Chat/chat.actions';
import { ChatService } from 'src/app/services/chat.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  chat: ResponseChat[];
  name: String;
  code: String;
  role: String;
  formChat: FormGroup;

  createFormChat(): FormGroup {
    return new FormGroup({
      message: new FormControl('', Validators.required),
    });
  }

  constructor(
    private uiService: UiService,
    private store: Store<AppState>,
    private chatService: ChatService
  ) {
    this.formChat = this.createFormChat();
    this.loadChat();
    this.uiService.updateTitleNavbar('Perfil');
  }

  ngOnInit(): void {
    this.subscription = this.store
      .pipe(filter(({ auth }) => auth.user !== null))
      .subscribe(({ chat, auth }) => {
        this.chat = chat.chat;
        this.code = auth.user.codigo;
        this.role = auth.user.rol;
        this.name = `${auth.user.nombre} ${auth.user.apellido}`;
      });
  }

  sendMessage() {
    if (!this.formChat.invalid) {
      const { message } = this.formChat.value;
      this.formChat.reset();
      this.chatService.sendMessage(message, this.name, this.code, this.role);
    }
  }

  loadChat() {
    const receiver = getValueOfLocalStorage('receiver');
    this.chatService.getMessages(receiver);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new DeleteChatAction());
  }
}
