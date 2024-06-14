import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { showAlert } from 'src/app/helpers/alert';
import { dateHourFormat } from 'src/app/helpers/ui';
import { BodyMeetActivateRol } from 'src/app/model/responseHistoryMeet';
import { WellnessService } from 'src/app/services/wellness.service';

@Component({
  selector: 'app-clinical-meet',
  templateUrl: './clinical-meet.component.html',
  styleUrls: ['./clinical-meet.component.css'],
})
export class ClinicalMeetComponent implements OnInit, OnDestroy {
  loading: Boolean = false;
  loadingMeet: Boolean = false;
  dateMeet: Date = new Date();
  student: String = '';
  idMeetClinical: String = '';
  idMeet: String = '';
  formHistoryMeet: FormGroup;
  subscription: Subscription = new Subscription();

  createFormHistoryMeet(): FormGroup {
    return new FormGroup({
      reasonConsultation: new FormControl('', Validators.required),
      generalIllness: new FormControl('', Validators.required),
      systemsReview: new FormControl('', Validators.required),
      heartRate: new FormControl('', Validators.required),
      breathingFrequency: new FormControl('', Validators.required),
      bloodPressure: new FormControl('', Validators.required),
      temperature: new FormControl('', Validators.required),
      weight: new FormControl('', Validators.required),
      size: new FormControl('', Validators.required),
    });
  }

  constructor(
    private store: Store<AppState>,
    private wellnessService: WellnessService,
    private router: Router
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
          role: role.roles.find(({ role }) => role === 'medico')._id.$oid,
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
    const body: BodyMeetActivateRol = { role, student, typeHistory: 'clinica' };
    const res = await this.wellnessService.getMeetActiveWithRole(body);
    if (!res.meet) {
      showAlert('error', 'No hay una reunión programada actualmente');
      this.router.navigate(['/estudiante/historia-clinica']);
      return;
    }
    let { date, hour, _id } = res.meet;
    date = dateHourFormat(date, hour);
    this.dateMeet = date;
    this.loadDefault(res.meetClinical);
    this.loadingMeet = false;
    this.idMeet = _id.$oid;
  }

  loadDefault(meetClinical) {
    if (meetClinical) {
      const {
        _id,
        reasonConsultation,
        generalIllness,
        systemsReview,
        heartRate,
        breathingFrequency,
        bloodPressure,
        temperature,
        weight,
        size,
      } = meetClinical;
      this.formHistoryMeet
        .get('reasonConsultation')
        .setValue(reasonConsultation);
      this.formHistoryMeet.get('generalIllness').setValue(generalIllness);
      this.formHistoryMeet.get('systemsReview').setValue(systemsReview);
      this.formHistoryMeet.get('heartRate').setValue(heartRate);
      this.formHistoryMeet
        .get('breathingFrequency')
        .setValue(breathingFrequency);
      this.formHistoryMeet.get('bloodPressure').setValue(bloodPressure);
      this.formHistoryMeet.get('temperature').setValue(temperature);
      this.formHistoryMeet.get('weight').setValue(weight);
      this.formHistoryMeet.get('size').setValue(size);
      this.idMeetClinical = _id.$oid;
    }
  }

  async onSubmit() {
    this.loading = true;
    if (!this.formHistoryMeet.invalid) {
      let meetClinical = {
        ...this.formHistoryMeet.value,
        meet: this.idMeet,
        student: this.student,
      };
      if (this.idMeetClinical) {
        meetClinical = {
          ...meetClinical,
          _id: this.idMeetClinical,
        };
      }
      const body = {
        type: this.idMeetClinical ? 'update' : 'create',
        meet: meetClinical,
        typeMeet: 'clinica',
      };
      const res = await this.wellnessService.createMeetHistory(body);
      res
        ? showAlert('success', 'Se ha guardado la información')
        : showAlert('error', 'No se pudo guardar la información');
      this.router.navigate(['/estudiante/historia-clinica']);
    }
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
