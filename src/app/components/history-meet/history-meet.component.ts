import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { reasonList } from 'src/app/model/data';
import { Reason } from 'src/app/model/meet';
import { showAlert } from 'src/app/helpers/alert';
import { WellnessService } from 'src/app/services/wellness.service';
import { dateHourFormat } from 'src/app/helpers/ui';
import { BodyMeetActivateRol } from 'src/app/model/responseHistoryMeet';

@Component({
  selector: 'app-history-meet',
  templateUrl: './history-meet.component.html',
  styleUrls: ['./history-meet.component.css'],
})
export class HistoryMeetComponent implements OnInit, OnDestroy {
  formHistoryMeet: FormGroup;
  loading: Boolean = false;
  loadingMeet: Boolean = false;
  idMeet: String = '';
  student: String = '';
  idMeetPsychological: String = '';
  reasons: Reason[] = reasonList;
  dateMeet: Date;
  reasonActive: String = 'PSICOLOGÍA';
  subscription: Subscription = new Subscription();
  @ViewChild('other') other: ElementRef;

  createFormHistoryMeet(): FormGroup {
    return new FormGroup({
      currentProblem: new FormControl('', Validators.required),
      diagnosis: new FormControl('', Validators.required),
      psychotherapeuticApproach: new FormControl('', Validators.required),
      forecast: new FormControl('', Validators.required),
    });
  }

  constructor(
    private wellnessService: WellnessService,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.formHistoryMeet = this.createFormHistoryMeet();
  }

  ngOnInit(): void {
    this.subscription = this.store
      .pipe(
        map(({ role, ui }) => ({ role, student: ui.userActive })),
        filter(({ student }) => student !== null),
        distinctUntilChanged((x, y) => x.student._id === y.student._id),
        map(({ role, student: { nombre, apellido, codigo, correo } }) => ({
          role: role.roles.find(({ role }) => role === 'psicologo')._id.$oid,
          student: { codigo, nombre: `${nombre} ${apellido}`, correo },
        }))
      )
      .subscribe(({ role, student }) => {
        this.student = student.codigo;
        this.loadMeetActive(role, student);
      });
  }

  async loadMeetActive(role, student) {
    this.loadingMeet = true;
    this.reasons = this.reasons.map((e) =>
      e.isActive ? { ...e, isActive: false } : e
    );
    this.reasons[5].isActive = true;
    const body: BodyMeetActivateRol = {
      role,
      student,
      typeHistory: 'psicologica',
    };
    const res = await this.wellnessService.getMeetActiveWithRole(body);
    if (!res.meet) {
      showAlert('error', 'No hay una reunión programada actualmente');
      this.router.navigate(['/estudiante/historia-psicologica']);
      return;
    }
    let { date, hour, _id } = res.meet;
    date = dateHourFormat(date, hour);
    this.dateMeet = date;
    this.loadDefault(res.meetPsychological);
    this.loadingMeet = false;
    this.idMeet = _id.$oid;
  }

  loadDefault(meetPsychological) {
    if (meetPsychological) {
      const {
        currentProblem,
        diagnosis,
        psychotherapeuticApproach,
        reasonMeet,
        forecast,
        _id,
      } = meetPsychological;
      this.formHistoryMeet.get('currentProblem').setValue(currentProblem);
      this.formHistoryMeet.get('diagnosis').setValue(diagnosis);
      this.formHistoryMeet
        .get('psychotherapeuticApproach')
        .setValue(psychotherapeuticApproach);
      this.formHistoryMeet.get('forecast').setValue(forecast);
      this.reasonActive = reasonMeet;
      this.reasons = this.reasons.map((i) =>
        i.name === reasonMeet
          ? { ...i, isActive: true }
          : { ...i, isActive: false }
      );
      this.idMeetPsychological = _id.$oid;
    }
  }

  activated(reason: String, index: number) {
    this.reasons = this.reasons.map((e) =>
      e.isActive ? { ...e, isActive: false } : e
    );
    this.reasons[index].isActive = true;
    this.other.nativeElement.value = '';
    this.reasonActive = reason;
  }

  changeToOther() {
    const other: String = this.other.nativeElement.value;
    this.reasonActive = other.length ? other.toUpperCase() : 'PSICOLOGÍA';
    if (other.length)
      this.reasons = this.reasons.map((e) =>
        e.isActive ? { ...e, isActive: false } : e
      );
    else this.reasons[5].isActive = true;
  }

  async onSubmit() {
    this.loading = true;
    if (!this.formHistoryMeet.invalid) {
      let meetPsychological = {
        ...this.formHistoryMeet.value,
        reasonMeet: this.reasonActive,
        meet: this.idMeet,
        student: this.student,
      };
      if (this.idMeetPsychological) {
        meetPsychological = {
          ...meetPsychological,
          _id: this.idMeetPsychological,
        };
      }
      const body = {
        type: this.idMeetPsychological ? 'update' : 'create',
        meet: meetPsychological,
        typeMeet: 'psicologica',
      };
      const res = await this.wellnessService.createMeetHistory(body);
      res
        ? showAlert('success', 'Se ha guardado la información')
        : showAlert('error', 'No se pudo guardar la información');
      this.router.navigate(['/estudiante/historia-psicologica']);
    }
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
