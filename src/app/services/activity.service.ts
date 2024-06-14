import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Activity, ResponseActivity } from '../model/activity';
import { User } from '../model/auth';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  endpoint: String = environment.url_backend;

  constructor(private httpClient: HttpClient) {}

  createActivities(activity) {
    return this.httpClient
      .post<ResponseActivity>(`${this.endpoint}/activity/`, activity)
      .toPromise();
  }

  listActivities() {
    return this.httpClient
      .get<Activity[]>(`${this.endpoint}/activity/`)
      .toPromise();
  }

  listActivitiesStudent() {
    return this.httpClient
      .get<Activity[]>(`${this.endpoint}/activity/activities-student`)
      .toPromise();
  }

  listActivitiesAsist(code: String) {
    return this.httpClient
      .get<Activity[]>(`${this.endpoint}/activity/asist/${code}`)
      .toPromise();
  }

  asistActivity(asist: Boolean, activity: String) {
    return this.httpClient
      .post<any>(`${this.endpoint}/activity/asist`, { asist, activity })
      .toPromise();
  }

  desactiveActivity(id: String) {
    return this.httpClient
      .get<any>(`${this.endpoint}/activity/desactive/${id}`)
      .toPromise();
  }

  updateActivity(id: String, activity: Activity) {
    const data = { id, activity };
    return this.httpClient
      .put<any>(`${this.endpoint}/activity/`, data)
      .toPromise();
  }

  downloadReport(id: String) {
    return this.httpClient
      .get<User[]>(`${this.endpoint}/activity/download/${id}`)
      .toPromise();
  }
}
