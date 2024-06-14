import { Component, OnInit } from '@angular/core';
import { getColorByRisk, normalizeText } from 'src/app/helpers/ui';
import { Activity } from 'src/app/model/activity';
import { Title } from 'src/app/model/ui';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
  selector: 'app-activities-student',
  templateUrl: './activities-student.component.html',
  styleUrls: ['./activities-student.component.css'],
})
export class ActivitiesStudentComponent implements OnInit {
  title: Title = {
    title: 'Listado de Actividades',
    subtitle:
      'Las actividades que se muestran a continuación se ajustan a su nivel de riesgo actual, es muy importante su asistencia y participación.',
  };

  activities: Activity[] = [];
  loading: Boolean = true;
  loadingAsistence: Boolean = false;

  constructor(private activityService: ActivityService) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  async loadActivities() {
    this.loading = true;
    const data = await this.activityService.listActivitiesStudent();
    this.activities = data;
    this.loading = false;
  }

  async asist(asist: Boolean, activity: String, i: number) {
    this.activities[i].loading = true;
    const res = await this.activityService.asistActivity(asist, activity);
    if (res.ok) {
      if (asist) {
        this.activities[i].asistance = true;
        this.activities[i].counter = this.activities[i].counter + 1;
      } else {
        this.activities[i].asistance = false;
        this.activities[i].counter = this.activities[i].counter - 1;
      }
    }
    this.activities[i].loading = false;
  }

  getColor(value: String) {
    return getColorByRisk(value);
  }

  normalize(text: String) {
    if (text === 'global') return 'Logo_SAT';
    return normalizeText(text);
  }
}
