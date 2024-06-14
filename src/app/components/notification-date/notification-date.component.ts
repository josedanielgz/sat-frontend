import { DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { showAlert } from 'src/app/helpers/alert';
import { normalizeRoles } from 'src/app/helpers/ui';
import { Meet } from 'src/app/model/meet';
import { Postulation } from 'src/app/model/risk';
import { Role } from 'src/app/model/role';
import { UpdateCounterAction } from 'src/app/reducer/notification/notification.actions';
import { WellnessService } from 'src/app/services/wellness.service';

@Component({
  selector: 'app-notification-date',
  templateUrl: './notification-date.component.html',
  styleUrls: ['./notification-date.component.css'],
})
export class NotificationDateComponent implements OnInit, OnDestroy {
  @Output() isClosed = new EventEmitter<any>();
  @Input() postulation: Postulation;
  today: Date = new Date();
  formDate: FormGroup;
  subscription: Subscription = new Subscription();
  student: any = null;
  loading: boolean = false;
  roles: Role[] = [];

  createFormDate(): FormGroup {
    return new FormGroup({
      role: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      ubication: new FormControl('', Validators.required),
    });
  }

  constructor(
    private store: Store<AppState>,
    private wellnessService: WellnessService
  ) {
    this.formDate = this.createFormDate();
  }

  ngOnInit(): void {
    this.subscription = this.store
      .pipe(
        map(({ ui: { userActive }, role }) => ({
          user: {
            codigo: userActive.codigo,
            nombre: `${userActive.nombre} ${userActive.apellido}`,
            correo: userActive.correo,
          },
          roles: role.roles,
        }))
      )
      .subscribe(({ user, roles }) => {
        this.student = user;
        this.roles = roles;
        this.setRole(this.roles[0]._id.$oid);
      });
  }

  close() {
    this.isClosed.emit(false);
  }

  onClick({ target }) {
    if (target.className === 'wrapper_alert') {
      this.close();
    }
  }

  setRole(role: String) {
    this.formDate.get('role').setValue(role);
  }

  normalize(role: String) {
    return normalizeRoles(role);
  }

  async onSubmit() {
    this.loading = true;
    if (!this.formDate.invalid) {
      const dateFormat = new DatePipe('es-Ar').transform(
        this.formDate.get('date').value,
        "EEEE, d 'de' MMMM 'del' y"
      );
      const meet: Meet = {
        ...this.formDate.value,
        state: 'SIN RESPONDER',
        attendance: false,
        student: this.student,
        dateFormat,
        postulation: this.postulation ? this.postulation._id.$oid : null,
      };
      const res = await this.wellnessService.createMeet(meet);
      if (res.ok) {
        this.store.dispatch(new UpdateCounterAction());
        if (this.postulation) this.postulation.state = 'NOTIFICADO PARA CITA';
        this.close();
      } else {
        showAlert('error', res.msg);
        this.close();
      }
    }
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
