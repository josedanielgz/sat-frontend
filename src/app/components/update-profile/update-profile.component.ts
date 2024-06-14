import { DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { showAlert } from 'src/app/helpers/alert';
import { buildWorkingDay } from 'src/app/helpers/times';
import { normalizeRoles } from 'src/app/helpers/ui';
import { Meet } from 'src/app/model/meet';
import { Role } from 'src/app/model/role';
import { AuthService } from 'src/app/services/auth.service';
import { UiService } from 'src/app/services/ui.service';
import { WellnessService } from 'src/app/services/wellness.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css'],
})
export class UpdateProfileComponent implements OnInit, OnDestroy {
  @Output() isClosed = new EventEmitter<boolean>();
  roles: Role[] = [];
  student: any = null;
  today: Date = new Date();
  times: String[] = [];
  loading: Boolean = false;
  subscription: Subscription = new Subscription();
  formMeet: FormGroup;

  createFormMeet(): FormGroup {
    return new FormGroup({
      role: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      hour: new FormControl('', Validators.required),
    });
  }

  constructor(
    private store: Store<AppState>,
    private uiService: UiService,
    private authService: AuthService,
    private wellnessService: WellnessService,
    private router: Router
  ) {
    this.formMeet = this.createFormMeet();
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

  resetDate() {
    this.formMeet.get('date').reset();
    this.formMeet.get('hour').setValue('');
    this.formMeet.get('hour').disable();
    this.times = [];
  }

  async onSubmit() {
    this.loading = true;
    if (!this.formMeet.invalid) {
      const dateFormat = new DatePipe('es-Ar').transform(
        this.formMeet.get('date').value,
        "EEEE, d 'de' MMMM 'del' y"
      );
      const meet: Meet = {
        ...this.formMeet.value,
        ubication: 'Oficina de bienestar, UFPS',
        state: 'ACEPTADA',
        attendance: false,
        student: this.student,
        dateFormat,
        postulation: null,
      };
      const { ok, msg } = await this.wellnessService.createMeetStudent(meet);
      if (ok) {
        showAlert('success', 'Se ha agendado una nueva cita');
        this.close();
        meet.role = this.roles.find((x) => x._id.$oid === meet.role).role;
        this.uiService.newMeet$.emit(meet);
        this.router.navigate(['/estudiante/reunion'], {
          fragment: 'contenedor',
        });
      } else {
        showAlert('error', msg);
        this.close();
      }
    }
    this.loading = false;
  }

  async getSchedule() {
    const dateInput = this.formMeet.get('date');
    const hourInput = this.formMeet.get('hour');
    const isSunday = new Date(dateInput.value).getDay() === 6;
    if (isSunday) {
      showAlert('warning', 'No se puede agendar citas los domingos');
      dateInput.reset();
      hourInput.setValue('');
      hourInput.disable();
      this.times = [];
    } else {
      const idRole = this.formMeet.get('role').value;
      const role = this.roles.find((role) => role._id.$oid === idRole).role;
      const date = dateInput.value;
      const res = await this.authService.getScheduleOfRole(role, date);
      if (res.ok) {
        const { morningStart, morningEnd, afternoonStart, afternoonEnd } =
          res.data.schedule;
        const morning = buildWorkingDay(morningStart, morningEnd, [
          morningStart,
        ]);
        const afternoon = buildWorkingDay(afternoonStart, afternoonEnd, [
          afternoonStart,
        ]);
        const times = [...morning, ...afternoon];
        this.times = times.filter((x) => !res.data.reservations.includes(x));
        if (this.times.length) {
          hourInput.setValue(this.times[0]);
          hourInput.enable();
        } else {
          showAlert(
            'error',
            'No hay horario disponible para el día seleccionado'
          );
          this.close();
        }
      } else {
        this.close();
      }
    }
  }

  setRole(role: String) {
    this.formMeet.get('hour').disable();
    this.formMeet.get('role').setValue(role);
  }

  normalize(role: String) {
    return normalizeRoles(role);
  }

  onClick({ target }) {
    if (target.className === 'wrapper_alert') {
      this.close();
    }
  }

  get role() {
    return this.formMeet.get('role');
  }

  get date() {
    return this.formMeet.get('date');
  }

  get hour() {
    return this.formMeet.get('hour');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
