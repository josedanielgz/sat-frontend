import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, map, pluck, tap, filter } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { showAlert, showQuestion } from 'src/app/helpers/alert';
import { saveInLocalStorage } from 'src/app/helpers/localStorage';
import { FilterMeet, Meet } from 'src/app/model/meet';
import { Postulation } from 'src/app/model/risk';
import { Title } from 'src/app/model/ui';
import { SetUserActiveAction } from 'src/app/reducer/ui/ui.actions';
import { StudentService } from 'src/app/services/student.service';
import { UiService } from 'src/app/services/ui.service';
import { WellnessService } from 'src/app/services/wellness.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent implements OnInit, OnDestroy {
  showDate: Boolean = false;
  title: Title = {
    title: 'Lista de Citas',
    subtitle: '',
  };
  subscription: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  totalPages: number[] = [];
  role: String = '';
  page: number = 0;
  meets: Meet[] = [];
  loading: Boolean = true;
  loadingNewMeet: Boolean = false;
  state: string = 'ACEPTADA';
  date: string = new Date().toISOString().split('T')[0];
  showModal: Boolean = false;
  postulation: Postulation = null;
  @ViewChild('checkboxYeah') checkboxYeah: ElementRef;
  @ViewChild('checkboxNot') checkboxNot: ElementRef;

  constructor(
    private uiService: UiService,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private wellnessService: WellnessService,
    private notificationService: NotificationService,
    private studentService: StudentService,
    private router: Router
  ) {
    this.uiService.updateTitleNavbar('Agenda');
  }

  ngOnInit(): void {
    this.subscription = this.route.params
      .pipe(
        pluck('pagina'),
        distinctUntilChanged(),
        map((page) => (!page ? '1' : page)),
        tap((page) => (this.page = parseInt(page)))
      )
      .subscribe((page) => this.loadMeets(page, this.state, this.date));

    this.subscription2 = this.store
      .select('auth')
      .pipe(
        pluck('user'),
        filter((user) => user !== null),
        distinctUntilChanged()
      )
      .subscribe(({ documento, rol }) => {
        this.role = rol;
        this.notificationService.getNotifications(documento);
      });
  }

  async loadMeets(page: string, state: string, date: string) {
    this.loading = true;
    const { totalPages, data } = await this.wellnessService.postulateMeet(
      page,
      state,
      date
    );
    this.totalPages = Array(totalPages)
      .fill(0)
      .map((_, i) => i + 1);
    this.meets = data;
    this.loading = false;
  }

  async toStudent(code: String) {
    this.loading = true;
    const data = await this.studentService.getByCode(code);
    if (data.ok) {
      saveInLocalStorage('user-show', data.data);
      this.router.navigate(['/estudiante/bitacora']);
    } else {
      showAlert('error', 'Algo salio mal');
    }
    this.loading = true;
  }

  onShowModal(show: FilterMeet = { show: true }) {
    this.showModal = show.show;
    if (show.state || show.date) {
      this.loadMeets('1', show.state, show.date);
      this.state = show.state;
    }
  }

  showDateNotification(show: boolean = true) {
    this.showDate = show;
  }

  async yeah(id: String, e: any, code: String, i: number) {
    const { isConfirmed, dismiss } = await showQuestion(
      '¿El estudiante SI asistio a la reunión?',
      'No se pueden revertir los cambios eventualmente'
    );
    if (!dismiss) {
      this.checkboxYeah.nativeElement.checked = isConfirmed;
      await this.wellnessService.attendanceMeet(id, isConfirmed, code);
      if (isConfirmed) this.meets.splice(i, 1);
    } else this.checkboxYeah.nativeElement.checked = !e.target.checked;
  }

  async not(id: String, e: any, i: number) {
    const { isConfirmed, dismiss } = await showQuestion(
      '¿El estudiante NO asistio a la reunión?',
      'No se pueden revertir los cambios eventualmente'
    );
    if (!dismiss) {
      this.checkboxNot.nativeElement.checked = isConfirmed;
      const reason =
        this.meets[i].state === 'SIN RESPONDER'
          ? 'El estudiante no respondió la cita'
          : 'El estudiante incumplió la cita';
      await this.wellnessService.acceptMeet(id, false, reason);
      if (isConfirmed) this.meets.splice(i, 1);
    } else this.checkboxNot.nativeElement.checked = !e.target.checked;
  }

  async openModalNotification(id, code) {
    this.loadingNewMeet = true;
    const { data } = await this.studentService.getByCode(code);
    this.store.dispatch(new SetUserActiveAction(data));
    if (id) {
      const { ...postulation } = await this.wellnessService.getPostulationById(
        id
      );
      this.postulation = postulation;
    }
    this.loadingNewMeet = false;
    this.showDateNotification();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
