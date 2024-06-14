import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter, pluck, tap } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { showAlert, showQuestion } from 'src/app/helpers/alert';
import { normalizeRoles } from 'src/app/helpers/ui';
import { buildWorkingDay } from 'src/app/helpers/times';
import { Meet } from 'src/app/model/meet';
import { AuthService } from 'src/app/services/auth.service';
import { UiService } from 'src/app/services/ui.service';
import { WellnessService } from 'src/app/services/wellness.service';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css'],
})
export class MeetingComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  meet: Meet = null;
  meets: Meet[] = [];
  loading: Boolean = true;
  showModalChat: boolean = false;
  role: String = '';
  res: Boolean = true;
  times: String[] = [];
  @ViewChild('reasons') reasons: ElementRef;
  @ViewChild('time') time: ElementRef;

  constructor(
    private uiService: UiService,
    private wellnessService: WellnessService,
    private authService: AuthService,
    private store: Store<AppState>
  ) {
    this.uiService.updateTitleNavbar('Asistencia Reunion');
  }

  ngOnInit(): void {
    this.subscription = this.store
      .select('ui')
      .pipe(
        filter(({ userActive }) => userActive !== null),
        pluck('userActive'),
        distinctUntilChanged(),
        tap(({ codigo }) => {
          this.loadMeets(codigo);
          this.getMeetsStudent(codigo);
        })
      )
      .subscribe();
    this.subscription2 = this.uiService.newMeet$.subscribe(
      (meet) => (this.meets = [meet, ...this.meets])
    );
  }

  async getMeetsStudent(code: String) {
    this.meets = await this.wellnessService.getMeetsStudent(code);
  }

  async loadMeets(code: String) {
    const data = await this.wellnessService.getMeetOfStudent(code);
    if (data) {
      this.meet = {
        ...data,
        role: normalizeRoles(data.role),
      };
      const res = await this.getScheduleOfRole(
        data.role,
        this.meet.date.toString()
      );
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
      }
    }
    this.loading = false;
  }

  async getScheduleOfRole(role: String, date: String) {
    return await this.authService.getScheduleOfRole(role, date);
  }

  normalize(role) {
    return normalizeRoles(role);
  }

  async accept(option: boolean) {
    const hour = this.time.nativeElement.value;
    const msg = option
      ? `¿Está seguro de programar la cita para las ${hour}?`
      : '¿Está seguro que quiere rechazar la cita?';
    const { isConfirmed } = await showQuestion(
      msg,
      'No se pueden revertir los cambios eventualmente'
    );
    if (isConfirmed) {
      this.loading = true;
      if (option) {
        await this.wellnessService.acceptMeet(this.meet._id.$oid, option, hour);
        this.updateStateMeet('ACEPTADA', hour);
        this.res = false;
      } else {
        const reason = this.reasons.nativeElement.value;
        if (!reason.length) {
          showAlert('warning', 'Debe escribir los motivos');
        } else {
          await this.wellnessService.acceptMeet(
            this.meet._id.$oid,
            option,
            reason
          );
          this.updateStateMeet('RECHAZADA', '');
          this.res = false;
        }
      }
      this.loading = false;
    }
  }

  updateStateMeet(newState: String, hour: String) {
    this.meets = this.meets.map((meet) => {
      if (meet._id.$oid === this.meet._id.$oid) {
        meet.state = newState;
        meet.hour = hour;
      }
      return meet;
    });
  }

  updateModal(show: boolean = true, role: String = '') {
    this.showModalChat = show;
    this.role = role;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
