import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { ResponseNotification } from 'src/app/model/notification';
import { UpdateCounterAction } from 'src/app/reducer/notification/notification.actions';
import { BossService } from 'src/app/services/boss.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-floating-button',
  templateUrl: './floating-button.component.html',
  styleUrls: ['./floating-button.component.css'],
})
export class FloatingButtonComponent implements OnInit, OnDestroy {
  @ViewChild('checkboxNotification') checkboxNotification: ElementRef;

  subscription: Subscription = new Subscription();
  code: String;
  role: String;
  notification: ResponseNotification[] = [];
  unread: Number = 0;
  counter: Number = 0;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private notificationService: NotificationService,
    private bossService: BossService
  ) {}

  ngOnInit(): void {
    this.subscription = this.store
      .pipe(filter(({ auth }) => auth.user !== null))
      .subscribe(({ auth, notification }) => {
        this.code = auth.user.codigo;
        this.role = auth.user.rol;
        this.notification = notification.notification;
        this.unread = notification.unread;
        this.counter = notification.counter;
      });
    this.getCounter();
  }

  async getCounter() {
    if (this.role === 'jefe' || this.role === 'vicerrector') {
      const { data } = await this.bossService.counterPostulation();
      this.store.dispatch(new UpdateCounterAction(data));
    }
  }

  deleteNotification(id: String) {
    this.notificationService.deleteNotification(id);
  }

  closeButton(notification: ResponseNotification) {
    if (notification.isActive)
      this.notificationService.updateNotification(notification._id.$oid);
    this.checkboxNotification.nativeElement.checked = false;
    if (notification.codeTransmitter) {
      this.loadUserShow(
        notification.codeTransmitter,
        notification.url,
        notification.roleTransmitter
      );
    } else {
      this.router.navigate([notification.url]);
    }
  }

  loadUserShow(code: String, url: String, role: String) {
    switch (role) {
      case 'docente':
      case 'jefe':
        role = 'teachers';
        break;
      case 'estudiante':
        role = 'students';
        break;
      case 'vicerrector':
        role = 'wellness';
        break;
      default:
        role = 'students';
    }
    this.notificationService.getUserInformed(code, role, url);
  }

  toPostulation() {
    this.checkboxNotification.nativeElement.checked = false;
    this.router.navigate(['/vicerrector/postulados/1']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
