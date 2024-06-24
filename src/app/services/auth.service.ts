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
import { Role, RoleResponse, RoleSchedule, ScheduleResponse } from '../model/role';
import { AddUserAction, RemoveUserAction } from '../reducer/auth/auth.actions';
import { AuthState } from '../reducer/auth/auth.reducer';
import { DeleteChatAction } from '../reducer/Chat/chat.actions';
import { DeleteCourseAction, DesactiveCourseAction } from '../reducer/course/course.actions';
import { DeleteNotificationsAction } from '../reducer/notification/notification.actions';
import { RemoveRiskAction } from '../reducer/risk/risk.action';
import { StartLoadingAction, FinishLoadingAction, SetError, UnsetUserActiveAction, SetUserActiveAction } from '../reducer/ui/ui.actions';
import { NewOAuthService } from './new.oauth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  endpoint: string = environment.url_backend;
  withOutToken: HttpClient;
  isAuth$: Observable<AuthState>;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private httpClient: HttpClient,
    private httpBackend: HttpBackend,
    private oauthService: NewOAuthService
  ) {
    this.withOutToken = new HttpClient(httpBackend);
    this.isAuth$ = this.store.select('auth');
  }

  async login(dataLogin: UserAuth, typeUser: string) {
    this.store.dispatch(new StartLoadingAction());
    try {
      const req = await this.withOutToken
        .post<AuthResponse>(`${this.endpoint}/auth/${typeUser}/login`, dataLogin)
        .toPromise();
      if (req.ok) {
        this.handleSuccessfulLogin(req);
      } else {
        showAlert('error', req.msg);
      }
    } catch (error) {
      this.handleLoginError(error);
    }
    this.store.dispatch(new FinishLoadingAction());
  }

  async loginWithGoogle(role: String) {
    this.store.dispatch(new StartLoadingAction());
    try {
      const userInfo = await this.oauthService.initLoginFlow();
      if (userInfo && userInfo.email && userInfo.email.endsWith('@ufps.edu.co')) {
        const loginResult = await this.oauthService.loginWithBackend(userInfo.email, role);
        if (loginResult && loginResult.ok) {
          this.handleSuccessfulLogin(loginResult);
        } else {
          showAlert('error', loginResult?.msg || 'Error durante el inicio de sesión');
          this.router.navigate([`/${role.toLowerCase()}/iniciar-sesion`]);
        }
      } else {
        showAlert('error', 'Debe ingresar con el correo institucional de la UFPS');
        this.oauthService.logout();
        this.router.navigate([`/${role.toLowerCase()}/iniciar-sesion`]);
      }
    } catch (error) {
      this.handleLoginError(error);
    } finally {
      this.store.dispatch(new FinishLoadingAction());
    }
  }

  private handleSuccessfulLogin(req: AuthResponse) {
    localStorage.setItem('x-token', req.token.toString());
    showAlert('success', req.msg);
    this.store.dispatch(new SetUserActiveAction(req.data));
    this.store.dispatch(new AddUserAction(req.data));
    saveInLocalStorage('user-show', req.data);
    this.router.navigate([`/${req.data.rol.toLowerCase()}`]);
  }

  private handleLoginError(error: any) {
    console.error('Error durante el inicio de sesión:', error);
    this.store.dispatch(new SetError('Ocurrió un error en el servidor', '/'));
    showAlert('error', error.error?.msg || 'Error de inicio de sesión');
    this.router.navigate(['/error']);
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
    localStorage.clear();
    const path = isTeacher(role)
      ? 'docente'
      : role === 'estudiante'
      ? 'estudiante'
      : 'administrativo';
    this.oauthService.logout();
    this.router.navigate([`${path}/iniciar-sesion`]);
  }

  // ... (resto de los métodos permanecen igual)

  renewToken() {
    return this.httpClient.get<AuthResponse>(`${this.endpoint}/auth/renew`).toPromise();
  }

  validateUserAuth(role: string = '') {
    return this.httpClient.get<boolean>(`${this.endpoint}/auth/validate-token/${role}`).toPromise();
  }

  sendEmailUpdatePassword(email: string) {
    return this.httpClient.post<boolean>(`${this.endpoint}/auth/administrative/recovery-password`, email).toPromise();
  }

  updatePassword(password: string) {
    return this.httpClient.put<boolean>(`${this.endpoint}/auth/administrative/recovery-password`, password).toPromise();
  }

  changePassword(password: string) {
    return this.httpClient.put<boolean>(`${this.endpoint}/auth/administrative/change-password`, password).toPromise();
  }

  createRole(role: RoleSchedule) {
    return this.httpClient.post<RoleResponse>(`${this.endpoint}/role/`, role).toPromise();
  }

  listRoles() {
    return this.withOutToken.get<Role[]>(`${this.endpoint}/role/`).toPromise();
  }

  updateSchedule(schedule: any) {
    return this.httpClient.put<any>(`${this.endpoint}/role/schedule`, schedule).toPromise();
  }

  getSchedule(role: string) {
    return this.httpClient.get<any>(`${this.endpoint}/role/schedule/${role}`).toPromise();
  }

  getScheduleOfRole(role: String, date: String) {
    return this.httpClient.get<ScheduleResponse>(`${this.endpoint}/role/schedule/role/${role}/${date}`).toPromise();
  }

  uploadPhoto(formData: FormData) {
    try {
      return this.httpClient.put<any>(`${this.endpoint}/auth/institutional/update-photo`, formData).toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
