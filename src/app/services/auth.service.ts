import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { AppState } from '../app.reducers';
import { showAlert } from '../helpers/alert';
import { saveInLocalStorage } from '../helpers/localStorage';
import { isTeacher } from '../helpers/ui';
import { AuthResponse, UserAuth } from '../model/auth';
import { removerActivityAction } from '../reducer/activity/activity.action';
import {
  Role,
  RoleResponse,
  RoleSchedule,
  ScheduleResponse,
} from '../model/role';
import { AddUserAction, RemoveUserAction } from '../reducer/auth/auth.actions';
import { AuthState } from '../reducer/auth/auth.reducer';
import { DeleteChatAction } from '../reducer/Chat/chat.actions';
import {
  DeleteCourseAction,
  DesactiveCourseAction,
} from '../reducer/course/course.actions';
import { DeleteNotificationsAction } from '../reducer/notification/notification.actions';
import { RemoveRiskAction } from '../reducer/risk/risk.action';
import {
  StartLoadingAction,
  FinishLoadingAction,
  SetError,
  UnsetUserActiveAction,
  SetUserActiveAction,
} from '../reducer/ui/ui.actions';
import { GoogleService } from './google.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  endpoint: String = environment.url_backend;
  withOutToken: HttpClient;
  isAuth$: Observable<AuthState> = null;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private httpClient: HttpClient,
    private httpBackend: HttpBackend,
    private googleService: GoogleService
  ) {
    this.withOutToken = new HttpClient(this.httpBackend);
    this.isAuth$ = this.store.select('auth');
  }

  async login(dataLogin: UserAuth, typeUser: String) {
    this.store.dispatch(new StartLoadingAction());
    try {
      const req = await this.withOutToken
        .post<AuthResponse>(
          this.endpoint + '/auth/' + typeUser + '/login',
          dataLogin
        )
        .toPromise();
      const { ok, msg } = req;
      if (ok) {
        localStorage.setItem('x-token', req.token.toString());
        showAlert('success', msg);
        this.store.dispatch(new SetUserActiveAction(req.data));
        this.store.dispatch(new AddUserAction(req.data));
        saveInLocalStorage('user-show', req.data);
        typeUser === 'administrative'
          ? this.router.navigate(['/administrativo'])
          : this.router.navigate([`/${req.data.rol.toLowerCase()}`]);
      } else {
        showAlert('error', msg);
      }
    } catch (error) {
      this.store.dispatch(new SetError('Ocurrio un error en el servidor', '/'));
      showAlert('error', error.error.msg);
      this.router.navigate(['/error']);
    }
    this.store.dispatch(new FinishLoadingAction());
  }

  renewToken() {
    return this.httpClient
      .get<AuthResponse>(this.endpoint + '/auth/renew')
      .toPromise();
  }

  validateUserAuth(role: String = '') {
    return this.httpClient
      .get<boolean>(this.endpoint + '/auth/validate-token/' + role)
      .toPromise();
  }

  sendEmailUpdatePassword(email) {
    return this.httpClient
      .post<Boolean>(
        `${this.endpoint}/auth/administrative/recovery-password`,
        email
      )
      .toPromise();
  }

  updatePassword(password) {
    return this.httpClient
      .put<Boolean>(
        `${this.endpoint}/auth/administrative/recovery-password`,
        password
      )
      .toPromise();
  }

  changePassword(password) {
    return this.httpClient
      .put<Boolean>(
        `${this.endpoint}/auth/administrative/change-password`,
        password
      )
      .toPromise();
  }

  createRole(role: RoleSchedule) {
    return this.httpClient
      .post<RoleResponse>(`${this.endpoint}/role/`, role)
      .toPromise();
  }

  listRoles() {
    return this.withOutToken.get<Role[]>(`${this.endpoint}/role/`).toPromise();
  }

  updateSchedule(schedule) {
    return this.httpClient
      .put<any>(`${this.endpoint}/role/schedule`, schedule)
      .toPromise();
  }

  getSchedule(role: String) {
    return this.httpClient
      .get<any>(`${this.endpoint}/role/schedule/${role}`)
      .toPromise();
  }

  getScheduleOfRole(role: String, date: String) {
    return this.httpClient
      .get<ScheduleResponse>(
        `${this.endpoint}/role/schedule/role/${role}/${date}`
      )
      .toPromise();
  }

  logout(role: String) {
    this.store.dispatch(new RemoveUserAction());
    this.store.dispatch(new DeleteCourseAction());
    this.store.dispatch(new UnsetUserActiveAction());
    this.store.dispatch(new DesactiveCourseAction());
    this.store.dispatch(new DeleteChatAction());
    this.store.dispatch(new DeleteNotificationsAction());
    this.store.dispatch(new FinishLoadingAction());
    this.store.dispatch(new RemoveRiskAction());
    this.store.dispatch(new removerActivityAction());
    localStorage.clear();
    const path = isTeacher(role)
      ? 'docente'
      : role === 'estudiante'
      ? 'estudiante'
      : 'administrativo';
    this.googleService.singOut();
    this.router.navigate([`${path}/iniciar-sesion`]);
  }

  uploadPhoto(formData: FormData) {
    try {
      return this.httpClient
        .put<any>(this.endpoint + '/auth/institutional/update-photo', formData)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
