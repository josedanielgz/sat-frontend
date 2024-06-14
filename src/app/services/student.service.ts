import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Course, ResponseCourse } from '../model/course';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducers';
import { LoadingCourseAction } from '../reducer/course/course.actions';
import { UserResponse } from '../model/auth';
import {
  FinishLoadingAction,
  StartLoadingAction,
} from '../reducer/ui/ui.actions';
import { NotificationService } from './notification.service';
import {
  Postulation,
  ProfitResponse,
  ResposeStudentPostulation,
  RiskResponse,
} from '../model/risk';
import { ResponseSemester } from '../model/semester';
import { Record, ResponseRecordHistory } from '../model/responseHistoryMeet';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  url: String = environment.url_backend;

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private notificationService: NotificationService
  ) {}

  async listCourses(code: String, acu012: Boolean) {
    try {
      this.store.dispatch(new StartLoadingAction());
      let courses: Course[] = [];
      const { data: matriculate } = await this.http
        .get<ResponseCourse>(this.url + '/students/course/' + code)
        .toPromise();
      courses = [...matriculate];
      if (acu012) {
        const { data: ac012 } = await this.http
          .get<ResponseCourse>(this.url + '/risk/courses/ac012/' + code)
          .toPromise();
        courses = [...courses, ...ac012];
      }
      this.store.dispatch(new LoadingCourseAction(courses));
      if (code) this.notificationService.getNotifications(code);
    } catch (error) {
      console.error(error);
    }
    this.store.dispatch(new FinishLoadingAction());
  }

  getCourses(code: String) {
    try {
      return this.http
        .get<ResponseCourse>(this.url + '/students/course/' + code)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  getCoursesAc012(code: String) {
    try {
      return this.http
        .get<ResponseCourse>(this.url + '/risk/courses/ac012/' + code)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  getTeacherOfCourse(code: String) {
    try {
      return this.http
        .get<UserResponse>(this.url + '/teachers/' + code)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  generatePostulation(postulation: Postulation) {
    try {
      return this.http
        .post<ResposeStudentPostulation>(
          this.url + '/students/postulate',
          postulation
        )
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  validatePostulation(data) {
    try {
      return this.http
        .post<Postulation>(this.url + '/students/postulate/validate', data)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  getProfits(code: String, risk: String) {
    try {
      return this.http
        .get<ProfitResponse>(
          this.url + '/students/profits/' + code + '/' + risk
        )
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  getProfitsAdmin(code: String, risk: String) {
    try {
      const params = new HttpParams()
        .set('code', code.toString())
        .set('risk', risk.toString());
      return this.http
        .get<ProfitResponse>(this.url + '/students/profits/risk', { params })
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  getByCode(code: String) {
    try {
      return this.http
        .get<UserResponse>(this.url + '/students/' + code)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  getSemesters(code: String) {
    try {
      return this.http
        .get<ResponseSemester>(this.url + '/students/semesters/' + code)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  getRisk(code: String) {
    try {
      code = '0000000';
      return this.http
        .get<RiskResponse>(this.url + '/risk/' + code)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getRecord(code: String, type: String) {
    try {
      return this.http
        .get<ResponseRecordHistory>(
          this.url + '/auth/institutional/record/' + code + '/' + type
        )
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async saveRecord(record: Record) {
    try {
      return this.http
        .post<Record>(this.url + '/auth/institutional/record', { record })
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
