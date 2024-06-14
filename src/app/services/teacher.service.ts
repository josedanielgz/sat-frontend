import { Location } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment.prod';
import { AppState } from '../app.reducers';
import { showAlert } from '../helpers/alert';
import { StudentResponse } from '../model/auth';
import { ResponseCourse } from '../model/course';
import {
  FilterStudentsAction,
  LoadingCourseAction,
  LoadStudentsAction,
} from '../reducer/course/course.actions';
import { FinishLoadingAction } from '../reducer/ui/ui.actions';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  url: String = environment.url_backend;

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private notificationService: NotificationService,
    private location: Location
  ) {}

  async listCourses(code: String) {
    try {
      const { data } = await this.http
        .get<ResponseCourse>(this.url + '/teachers/course/' + code)
        .toPromise();
      this.store.dispatch(new LoadingCourseAction(data));
      if (code) this.notificationService.getNotifications(code);
    } catch (error) {
      console.error(error);
    }
    this.store.dispatch(new FinishLoadingAction());
  }

  async listStudentsOfCourse(
    code: String,
    group: String,
    page: Number = 1,
    limit: Number = 15,
    filter: String = '',
    isFilter: Boolean = false
  ) {
    try {
      const params = new HttpParams()
        .append('page', '' + page)
        .append('limit', '' + limit)
        .append('filter', '' + filter);
      const res = await this.http
        .get<any>(
          this.url + '/teachers/course/students/' + code + '/' + group,
          { params }
        )
        .toPromise();
      if (isFilter) {
        if (!res.ok) {
          this.store.dispatch(
            new FilterStudentsAction({ students: [], totalPages: 0 })
          );
        } else {
          this.store.dispatch(new FilterStudentsAction(res.data));
        }
      } else {
        if (!res.ok) {
          this.location.back();
        } else {
          this.store.dispatch(new LoadStudentsAction(res.data));
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  getNotesCourse(infoCourse: any) {
    try {
      return this.http
        .post<any>(`${this.url}/teachers/course/notes`, infoCourse)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
