import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class NewOAuthService {
  private oauthConfig: AuthConfig = {
    issuer: 'https://accounts.google.com',
    strictDiscoveryDocumentValidation: false,
    redirectUri: window.location.origin + '/estudiante',
    clientId: '594625970943-8k5elv0om568kmfn76g8j7kbgctk67oi.apps.googleusercontent.com',
    scope: 'openid profile email https://www.googleapis.com/auth/gmail.readonly',
    responseType: 'code',
    showDebugInformation: !environment.production,
    useSilentRefresh: true,
    silentRefreshTimeout: 5000,
    timeoutFactor: 0.75,
    sessionChecksEnabled: false,
    clearHashAfterLogin: false,
  };

  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(this.oauthConfig);
    //this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  async initAuth(): Promise<void> {
    try {
      await this.oauthService.loadDiscoveryDocumentAndTryLogin();
    } catch (error) {
      console.error('Error loading discovery document:', error);
      throw error;
    }
  }

  async login(role: string): Promise<any> {
    try {
      await this.initAuth(); // Aseguramos que el documento de descubrimiento se cargue primero
      this.oauthService.initLoginFlow(); // Iniciamos el flujo de login

      console.log('PASA EL LOGIN')
      // Esperamos a que se complete la autenticación
      const loginResult = await this.waitForAuthentication();
      console.log(loginResult)
      if (loginResult && this.oauthService.hasValidAccessToken()) {
        const userProfile = await this.oauthService.loadUserProfile();
        return {
          email: userProfile['email'],
          role: role
        };

      }
      return null;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  private waitForAuthentication(): Promise<boolean> {
    return new Promise((resolve) => {
      const subscription = this.oauthService.events.subscribe(event => {
        if (event.type === 'token_received') {
          subscription.unsubscribe();
          resolve(true);
        }
      });

      // Timeout after 2 minutes
      setTimeout(() => {
        subscription.unsubscribe();
        resolve(false);
      }, 120000);
    });
  }

  logout() {
    this.oauthService.logOut();
  }

  getAccessToken(): string {
    return this.oauthService.getAccessToken();
  }
}
