import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserChat } from 'src/app/model/chat';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-modal-chat',
  templateUrl: './modal-chat.component.html',
  styleUrls: ['./modal-chat.component.css'],
})
export class ModalChatComponent implements OnInit {
  @Output() isClosed = new EventEmitter<boolean>();
  @Input() role: String;
  admins: UserChat[] = [];

  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit(): void {
    this.getAdmins();
  }

  async getAdmins() {
    const data = await this.chatService.getAdmins(this.role);
    this.admins = data;
  }

  toChat(document: String) {
    this.router.navigate(['/estudiante/chat-admin/' + document]);
  }

  onClick({ target }) {
    if (target.className.includes('wrapper_alert')) {
      this.isClosed.emit(false);
    }
  }
}
