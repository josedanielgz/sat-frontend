// src/app/services/auth.service.ts

import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, lastValueFrom } from 'rxjs'; // lastValueFrom para modernizar peticiones

// Delegación: Importa el servicio experto para Google
import { GoogleAuthFacadeService } from './google-auth-facade.service'; 

import { environment } from 'src/environments/environment.prod';
import { AppState } from '../app.reducers';
import { showAlert } from '../helpers/alert';
import { saveInLocalStorage } from '../helpers/localStorage';
import { isTeacher } from '../helpers/ui';
import { AuthResponse, UserAuth } from '../model/auth';
import { Role, RoleResponse, RoleSchedule, ScheduleResponse } from '../model/role';
import { AddUserAction, RemoveUserAction } from '../reducer/auth/auth.actions';
import { AuthState } from '../reducer/auth/auth.reducer';
import { DeleteCourseAction, DesactiveCourseAction } from '../reducer/course/course.actions';
import { DeleteNotificationsAction } from '../reducer/notification/notification.actions';
import { RemoveRiskAction } from '../reducer/risk/risk.action';
import { StartLoadingAction, FinishLoadingAction, SetError, UnsetUserActiveAction, SetUserActiveAction } from '../reducer/ui/ui.actions';


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
    private googleAuthFacade: GoogleAuthFacadeService // Inyección de la Fachada de Google
  ) {
    this.withOutToken = new HttpClient(httpBackend);
    this.isAuth$ = this.store.select('auth');
  }

  // --- 1. LOGIN POR CREDENCIALES ---

  async login(dataLogin: UserAuth, typeUser: string) {
    this.store.dispatch(new StartLoadingAction());
    try {
      const req = await lastValueFrom(
        this.withOutToken.post<AuthResponse>(`${this.endpoint}/auth/${typeUser}/login`, dataLogin)
      );

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

  // --- 2. LOGIN POR GOOGLE (DELEGADO) ---

  async loginWithGoogle(role: String) {
    this.store.dispatch(new StartLoadingAction());
    try {
      // Delega toda la complejidad del flujo OIDC y validación de dominio
      const loginResult = await this.googleAuthFacade.loginWithGoogle(role);
      
      if (loginResult && loginResult.ok) {
        this.handleSuccessfulLogin(loginResult);
        console.log("Logueo exitoso");
      } else {
        // En caso de error (dominio incorrecto, fallo de backend, etc.)
        const loginErrorPath = this.getLoginPath(role.toString()); 
        showAlert('error', loginResult?.msg || 'Error durante el inicio de sesión con Google.');
        this.router.navigate([loginErrorPath]);
      }
    } catch (error) {
      this.handleLoginError(error);
    } finally {
      this.store.dispatch(new FinishLoadingAction());
    }
  }

  // --- 3. CIERRE DE SESIÓN (COORDINADO) ---

  logout(role: String) {
    this.cleanState(); 
    localStorage.clear();
    
    // Cierra la sesión OIDC (delegado al experto)
    this.googleAuthFacade.logout(); 
    
    this.router.navigate([this.getLoginPath(role.toString())]); 
  }
  
  // --- MÉTODOS DE MANEJO DE ESTADO Y AUXILIARES ---
  
  private cleanState(): void {
    // Agrupa todas las acciones de limpieza de estado (sin DeleteChatAction)
    this.store.dispatch(new RemoveUserAction());
    this.store.dispatch(new DeleteCourseAction());
    this.store.dispatch(new UnsetUserActiveAction());
    this.store.dispatch(new DesactiveCourseAction());
    this.store.dispatch(new DeleteNotificationsAction());
    this.store.dispatch(new RemoveRiskAction());
    this.store.dispatch(new FinishLoadingAction());
  }

  private getLoginPath(role: string): string {
    const lowerRole = role.toLowerCase();
    if (lowerRole === 'docente') return 'docente/iniciar-sesion';
    if (lowerRole === 'estudiante') return 'estudiante/iniciar-sesion';
    return 'administrativo/iniciar-sesion';
  }

  private handleSuccessfulLogin(req: AuthResponse) {
    localStorage.setItem('x-token', req.token.toString());
    showAlert('success', req.msg);
    this.store.dispatch(new SetUserActiveAction(req.data));
    this.store.dispatch(new AddUserAction(req.data));
    saveInLocalStorage('user-show', req.data);
    this.redirectBasedOnRole(req.data.rol);
  }

  private handleLoginError(error: any) {
    console.error('Error durante el inicio de sesión:', error);
    this.store.dispatch(new SetError('Ocurrió un error en el servidor', '/'));
    showAlert('error', error.error?.msg || 'Error de inicio de sesión');
    this.router.navigate(['/error']);
  }

  private redirectBasedOnRole(role: string) {
    switch (role.toLowerCase()) {
      case 'docente':
        this.router.navigate(['/docente']);
        break;
      case 'estudiante':
        this.router.navigate(['/estudiante']);
        break;
      case 'vicerrector':
      case 'jefe':
      case 'psicologo':
      case 'medico':
        this.router.navigate(['/administrativo']);
        break;
      default:
        this.router.navigate([this.getLoginPath('estudiante')]);
        break;
    }
  }

  // --- MÉTODOS DE API VARIOS (usando lastValueFrom) ---

  renewToken() {
    return lastValueFrom(this.httpClient.get<AuthResponse>(`${this.endpoint}/auth/renew`));
  }

  validateUserAuth(role: string = '') {
    return lastValueFrom(this.httpClient.get<boolean>(`${this.endpoint}/auth/validate-token/${role}`));
  }

  sendEmailUpdatePassword(email: string) {
    return lastValueFrom(this.httpClient.post<boolean>(`${this.endpoint}/auth/administrative/recovery-password`, email));
  }

  updatePassword(password: string) {
    return lastValueFrom(this.httpClient.put<boolean>(`${this.endpoint}/auth/administrative/recovery-password`, password));
  }

  changePassword(password: string) {
    return lastValueFrom(this.httpClient.put<boolean>(`${this.endpoint}/auth/administrative/change-password`, password));
  }

  createRole(role: RoleSchedule) {
    return lastValueFrom(this.httpClient.post<RoleResponse>(`${this.endpoint}/role/`, role));
  }

  listRoles() {
    return lastValueFrom(this.withOutToken.get<Role[]>(`${this.endpoint}/role/`));
  }

  updateSchedule(schedule: any) {
    return lastValueFrom(this.httpClient.put<any>(`${this.endpoint}/role/schedule`, schedule));
  }

  getSchedule(role: string) {
    return lastValueFrom(this.httpClient.get<any>(`${this.endpoint}/role/schedule/${role}`));
  }

  getScheduleOfRole(role: String, date: String) {
    return lastValueFrom(this.httpClient.get<ScheduleResponse>(`${this.endpoint}/role/schedule/role/${role}/${date}`));
  }

  async uploadPhoto(formData: FormData) {
    try {
      return await lastValueFrom(this.httpClient.put<any>(`${this.endpoint}/auth/institutional/update-photo`, formData));
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}