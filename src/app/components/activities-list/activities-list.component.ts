import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, pluck, distinctUntilChanged } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { getColorByRisk } from 'src/app/helpers/ui';
import { Activity } from 'src/app/model/activity';
import { ActivityService } from 'src/app/services/activity.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-activities-list',
  templateUrl: './activities-list.component.html',
  styleUrls: ['./activities-list.component.css'],
})
export class ActivitiesListComponent implements OnInit, OnDestroy {
  activities: Activity[] = [];
  subscription: Subscription = new Subscription();
  loading: Boolean = true;
  title: String;

  constructor(
    private uiService: UiService,
    private store: Store<AppState>,
    private activityService: ActivityService
  ) {
    this.uiService.updateTitleNavbar('Asistencia Actividades');
  }

  ngOnInit(): void {
    this.subscription = this.store
      .select('ui')
      .pipe(
        pluck('userActive'),
        filter((userActive) => userActive !== null),
        distinctUntilChanged()
      )
      .subscribe(({ codigo }) => this.loadActivities(codigo));
  }

  async loadActivities(code: String) {
    this.loading = true;
    const data = await this.activityService.listActivitiesAsist(code);
    this.activities = data;
    this.loading = false;
  }

  getColor(value: String) {
    return getColorByRisk(value);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
