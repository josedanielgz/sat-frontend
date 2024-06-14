import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import { showQuestion } from 'src/app/helpers/alert';
import { generatePDF } from 'src/app/helpers/pdf';
import { createTableActivity } from 'src/app/helpers/report';
import { getColorByRisk, parseDate } from 'src/app/helpers/ui';
import { Activity } from 'src/app/model/activity';
import {
  DeleteActivityAction,
  LoadingActivityAction,
  UnsetLoadingActivityAction,
  loandActivitiesAction,
  SetActiveAction,
} from 'src/app/reducer/activity/activity.action';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css'],
})
export class ActivitiesComponent implements OnInit, OnDestroy {
  create: boolean = false;
  activities: Activity[] = [];
  hours: Date[] = [];
  subscription: Subscription = new Subscription();
  constructor(
    private activityService: ActivityService,
    private store: Store<AppState>
  ) {
    this.listActivity();
  }

  ngOnInit(): void {
    this.subscription = this.store
      .select('activity')
      .subscribe(({ activities }) => (this.activities = activities));
  }

  createActivity(answer: boolean = true, active: Activity = null) {
    this.create = answer;
    if (active) this.setActive(active);
  }

  async listActivity() {
    const activities = await this.activityService.listActivities();
    this.store.dispatch(new loandActivitiesAction(activities));
  }

  getColor(value: String) {
    return getColorByRisk(value);
  }

  async desactiveActivity(id: String) {
    const { isConfirmed } = await showQuestion(
      '¿Está seguro de desactivar la actividad?',
      'No se pueden revertir los cambios'
    );
    if (isConfirmed) {
      this.store.dispatch(new LoadingActivityAction(id));
      const res = await this.activityService.desactiveActivity(id);
      if (res.ok) {
        this.store.dispatch(new DeleteActivityAction(id));
      }
    }
  }

  setActive(activity: Activity) {
    this.store.dispatch(new SetActiveAction(activity));
  }

  async download(activity: String, name: String, date: Date, place: String) {
    this.store.dispatch(new LoadingActivityAction(activity));
    const students = await this.activityService.downloadReport(activity);
    const formatDate = parseDate(new Date(date));
    const msg = `Listado de asistencia para la actividad ${name} realizada el ${formatDate} en ${place}`;
    this.store.dispatch(new UnsetLoadingActivityAction(activity));
    generatePDF(students, msg, createTableActivity);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
