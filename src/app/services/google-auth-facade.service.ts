// src/app/services/google-auth-facade.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc'; // Importaciones de la librería OIDC

import { environment } from 'src/environments/environment.prod';
import { AuthResponse } from '../model/auth'; 
import { showAlert } from '../helpers/alert';


// Configuración OIDC para Google
const authCodeFlowConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,
  clientId: '594625970943-8k5elv0om568kmfn76g8j7kbgctk67oi.apps.googleusercontent.com',
  scope: 'openid profile email',
  showDebugInformation: !environment.production,
};

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthFacadeService {
  private endpoint: string = environment.url_backend;

  constructor(
    private oauthService: OAuthService, // Inyección de la librería OIDC
    private httpClient: HttpClient
  ) {
    this.configureOAuth();
  }

  // --- CONFIGURACIÓN OIDC ---
  private configureOAuth() {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }
  
  // --- MÉTODO DE LOGIN PRINCIPAL (Llamado por AuthService) ---
  
  async loginWithGoogle(role: String): Promise<AuthResponse | null> {
    try {
      // 1. Iniciar/Esperar el flujo OIDC y obtener claims
      const claims = await this.waitForTokenAndGetClaims(); 

      if (!claims || !claims.email) {
          // El mensaje de error se gestiona en AuthService, solo limpiamos y retornamos
          this.oauthService.logOut();
          return null; 
      }
      
      const correo = claims.email;
      const domine = correo.split('@')[1];

      // 2. Validación de Dominio
      if (domine === 'ufps.edu.co') {
        
        const userAuth = {
          correo: correo, // Correo institucional real
          rol: role,
        };

        // 3. Llamada al Backend Institucional
        return await this.loginWithBackend(userAuth);
        
      } else {
        // Fallo en la validación del dominio
        this.oauthService.logOut();
        // Devolvemos una respuesta que AuthService pueda interpretar como fallo de negocio
        return { ok: false, msg: 'Debe ingresar con el correo institucional de la UFPS', token: '', data: null };
      }
    } catch (error) {
      console.error('Error en el flujo de Google:', error);
      this.oauthService.logOut();
      return null;
    }
  }

  // --- MÉTODOS OIDC DE BAJO NIVEL ---
  
  private waitForTokenAndGetClaims(): Promise<any> {
    if (!this.oauthService.hasValidAccessToken()) {
        // Inicia el flujo de login si no hay un token válido
        this.oauthService.initLoginFlow();
    }
    
    return new Promise((resolve, reject) => {
        if (this.oauthService.hasValidAccessToken()) {
             // Si el token ya está, lo resolvemos inmediatamente
             resolve(this.oauthService.getIdentityClaims());
             return;
        }

        // Espera eventos de la librería OIDC
        const subscription = this.oauthService.events.subscribe(event => {
          if (event.type === 'token_received') {
            subscription.unsubscribe();
            resolve(this.oauthService.getIdentityClaims());
          }
          if (event.type === 'silent_refresh_timeout' || event.type === 'token_error') {
            subscription.unsubscribe();
            resolve(null); 
          }
        });
    });
  }
  
  // --- LLAMADA AL BACKEND INSTITUCIONAL ---
  
  private async loginWithBackend(dataLogin: { correo: string, rol: String }): Promise<AuthResponse | null> {
    try {
      // Usa lastValueFrom para la llamada al backend institucional
      return await lastValueFrom(
        this.httpClient
          .post<AuthResponse>(
            `${this.endpoint}/auth/institutional/login-google`,
            dataLogin
          )
      );
    } catch (error) {
      console.error('Error durante el login con el backend:', error);
      // En caso de error de red o HTTP, devolvemos un objeto de fallo
      const errorMessage = (error as any)?.error?.msg || 'Error desconocido al validar con el servidor institucional.';
      return { ok: false, msg: errorMessage, token: '', data: null };
    }
  }
  
  // --- MÉTODO DE LOGOUT OIDC ---
  
  logout() {
    this.oauthService.logOut();
  }
}