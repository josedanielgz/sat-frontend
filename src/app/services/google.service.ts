// src/app/services/auth.service.ts (o el nombre que mejor se ajuste)

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

// Dependencias de OIDC
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

// Dependencias de NgRx y Helpers
import { environment } from 'src/environments/environment.prod';
import { AppState } from '../app.reducers';
import { showAlert } from '../helpers/alert';
import { saveInLocalStorage } from '../helpers/localStorage';
import { AddUserAction } from '../reducer/auth/auth.actions';

// CONFIGURACIÓN DE OIDC (Se mantiene la de NewOAuthService)
const authCodeFlowConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,
  clientId: '594625970943-8k5elv0om568kmfn76g8j7kbgctk67oi.apps.googleusercontent.com',
  scope: 'openid profile email', // Solicitando los datos básicos
  showDebugInformation: !environment.production,
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private endpoint: string = environment.url_backend;

  constructor(
    // Componentes core
    private readonly oAuthService: OAuthService,
    private readonly httpClient: HttpClient,
    private readonly router: Router,

    // Componentes de estado y utilidades (trasladados de GoogleService)
    private store: Store<AppState>
  ) {
    this.configureOAuth();
  }

  // --- CONFIGURACIÓN CORE ---

  private configureOAuth() {
    this.oAuthService.configure(authCodeFlowConfig);
    // Intentar iniciar sesión automáticamente si hay un código en la URL
    this.oAuthService.loadDiscoveryDocumentAndTryLogin();
  }

  // --- FLUJO DE LOGIN (FUNCIÓN PRINCIPAL) ---

  /**
   * Inicia el flujo de autenticación con Google (OIDC) y luego realiza
   * la validación de dominio y autenticación con el Backend.
   * @param rol Rol del usuario a autenticar ('student', 'teacher', 'boss', etc.)
   * @param type Tipo de usuario para la lógica interna (ej. sobrescritura de email)
   */
  async initLoginAndValidate(rol: String, type?: String): Promise<void> {
    
    // 1. Iniciar o reanudar el flujo OIDC
    if (!this.hasValidToken()) {
      this.oAuthService.initLoginFlow();
      // El flujo redirige, y al volver, 'token_received' es emitido.
    }
    
    // 2. Esperar el token y obtener la información del usuario
    const claims = await this.waitForTokenAndGetClaims();
    if (!claims) {
      // El usuario pudo cancelar o hubo un error
      showAlert('error', 'Fallo en la autenticación con Google.');
      return;
    }
    
    // 3. Lógica de Negocio: Validación de Dominio (tomada de GoogleService)
    const correo = claims.email;
    const domine = correo.split('@')[1];

    if (domine === 'ufps.edu.co') {
      
      // Lógica de sobrescritura de correo (si es necesario)
      const emailAux =
        type === 'teacher'
          ? 'juancarlosso@ufps.edu.co' // Usar el correo de prueba para tipo 'teacher'
          : 'judithdelpilarrt@ufps.edu.co'; // Usar el correo de prueba para tipo 'otros'

      const userAuth = {
        correo: rol === 'student' ? correo : emailAux,
        rol,
      };

      // 4. Autenticación con el Backend (trasladado de GoogleService)
      const res = await this.loginWithBackend(userAuth);
      
      if (res && res.ok) {
        // 5. Éxito: Guardar estado (NgRx, LocalStorage) y redirigir
        localStorage.setItem('x-token', res.token.toString());
        showAlert('success', res.msg);
        this.store.dispatch(new AddUserAction(res.data));
        saveInLocalStorage('user-show', res.data);
        this.router.navigate([`/${res.data.rol.toLowerCase()}`]);
      } else {
        // 5. Fallo de Backend: Mostrar error y cerrar sesión
        showAlert('error', res?.msg || 'Error al autenticar con el servidor.');
        this.logout();
      }
    } else {
      // 5. Fallo de Dominio: Mostrar error y cerrar sesión
      showAlert(
        'error',
        'Debe ingresar con el correo institucional de la UFPS'
      );
      this.logout();
    }
  }
  
  /**
   * Espera la recepción del token OIDC después de la redirección.
   */
  private waitForTokenAndGetClaims(): Promise<any> {
      return new Promise((resolve) => {
        // Si ya tiene un token válido (ej. al recargar la página), obtiene los claims de inmediato.
        if (this.hasValidToken()) {
             resolve(this.oAuthService.getIdentityClaims());
             return;
        }

        // Si no, espera el evento de token recibido.
        const subscription = this.oAuthService.events.subscribe(event => {
          if (event.type === 'token_received') {
            subscription.unsubscribe();
            resolve(this.oAuthService.getIdentityClaims());
          }
          if (event.type === 'silent_refresh_timeout' || event.type === 'discovery_document_load_error') {
            subscription.unsubscribe();
            resolve(null); // Fallo de autenticación
          }
        });
      });
  }

  // --- MÉTODOS DE API BACKEND Y UTILITY ---

  /**
   * Llama al endpoint de tu backend para validar el login.
   * (Unificación de loginGoogle y loginWithBackend)
   */
  async loginWithBackend(dataLogin: { correo: string, rol: String }): Promise<any> {
    try {
      const res = await this.httpClient
        .post<any>(
          `${this.endpoint}/auth/institutional/login-google`,
          dataLogin
        )
        .toPromise(); // Manteniendo .toPromise() por compatibilidad con Angular 12
      return res;
    } catch (error) {
      console.error('Error durante el login con el backend:', error);
      return null;
    }
  }

  hasValidToken(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  /**
   * Cierra la sesión OIDC y limpia el estado local.
   */
  logout() {
    this.oAuthService.logOut();
    localStorage.removeItem('x-token');
    localStorage.removeItem('user-show');
    this.store.dispatch(/* Aquí iría la acción de Logout de NgRx si la tienes */);
    this.router.navigate(['/']); 
  }

  getAccessToken(): string {
    return this.oAuthService.getAccessToken();
  }
}