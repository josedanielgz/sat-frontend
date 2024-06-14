import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import { showAlert } from 'src/app/helpers/alert';
import { getDateUTC } from 'src/app/helpers/ui';
import { Activity } from 'src/app/model/activity';
import {
  loandActivityAction,
  UnsetActiveAction,
  UpdateActivityAction,
} from 'src/app/reducer/activity/activity.action';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
  selector: 'app-modal-activity',
  templateUrl: './modal-activity.component.html',
  styleUrls: ['./modal-activity.component.css'],
})
export class ModalActivityComponent implements OnInit, OnDestroy {
  @Output() isClosed = new EventEmitter<boolean>();

  formCreateActivity: FormGroup;
  currentDate: Date = new Date();
  loading: boolean = false;
  today: Date = new Date();
  title: String = 'Cargando...';
  textButton: String = 'Cargando...';
  active: Activity = null;
  subscription: Subscription = new Subscription();

  constructor(
    private activityService: ActivityService,
    private store: Store<AppState>
  ) {}

  createFormCreateActivity(
    name: String = '',
    date: String = new Date(getDateUTC()).toISOString().slice(0, 16),
    place: String = '',
    risk: String = '',
    riskLevel: String = '',
    description: String = ''
  ): FormGroup {
    return new FormGroup({
      name: new FormControl(name, Validators.required),
      date: new FormControl(date, Validators.required),
      place: new FormControl(place, Validators.required),
      risk: new FormControl(risk, Validators.required),
      riskLevel: new FormControl(riskLevel, Validators.required),
      description: new FormControl(description, Validators.required),
    });
  }

  ngOnInit(): void {
    this.subscription = this.store
      .select('activity')
      .subscribe(({ active }) => {
        if (active) {
          this.active = active;
          this.title = 'Editar una actividad';
          this.textButton = 'Actualizar';
          const { name, date, place, risk, riskLevel, description } = active;
          this.formCreateActivity = this.createFormCreateActivity(
            name,
            new Date(getDateUTC(new Date(date))).toISOString().slice(0, 16),
            place,
            risk,
            riskLevel,
            description
          );
          this.formCreateActivity.get('risk').disable();
          this.formCreateActivity.get('riskLevel').disable();
        } else {
          this.title = 'Crear una actividad';
          this.textButton = 'Crear';
          this.formCreateActivity = this.createFormCreateActivity();
        }
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

  change() {
    this.formCreateActivity.get('risk').value === 'global'
      ? this.formCreateActivity.get('riskLevel').setValue('global')
      : this.formCreateActivity.get('riskLevel').setValue('');
  }

  async onSubmit() {
    this.loading = true;
    if (!this.formCreateActivity.invalid) {
      const date = new Date(this.formCreateActivity.get('date').value);
      date.toISOString();
      const activities = {
        ...this.formCreateActivity.value,
        date,
      };

      if (!this.active) {
        const activity = await this.activityService.createActivities(
          activities
        );
        let aux = activity.data;
        aux = {
          ...aux,
          _id: {
            $oid: aux._id,
          },
        };
        this.store.dispatch(new loandActivityAction(aux));
        this.close();
        showAlert('success', 'Actividad fue creada con exito');
      } else {
        const id = this.active._id.$oid;
        const activity = { ...this.formCreateActivity.value };
        const data = await this.activityService.updateActivity(id, activity);
        if (data.ok) {
          this.close();
          showAlert('success', 'Actividad fue actualizada con exito');
          this.store.dispatch(
            new UpdateActivityAction({
              id,
              activity,
            })
          );
        }
      }
    }
    this.loading = false;
  }

  get name() {
    return this.formCreateActivity.get('name');
  }

  get date() {
    return this.formCreateActivity.get('date');
  }

  get place() {
    return this.formCreateActivity.get('place');
  }

  get risk() {
    return this.formCreateActivity.get('risk');
  }

  get riskLevel() {
    return this.formCreateActivity.get('riskLevel');
  }

  get description() {
    return this.formCreateActivity.get('description');
  }

  ngOnDestroy(): void {
    this.store.dispatch(new UnsetActiveAction());
    this.subscription.unsubscribe();
  }
}
