import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment.prod';

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
export class NewOAuthService {
  private endpoint: string = environment.url_backend;

  constructor(
    private readonly oAuthService: OAuthService,
    private readonly httpClient: HttpClient
  ) {
    this.configureOAuth();
  }

  private configureOAuth() {
    this.oAuthService.configure(authCodeFlowConfig);
    this.oAuthService.loadDiscoveryDocumentAndTryLogin();
  }

  async initLoginFlow(): Promise<any> {
    if (!this.hasValidToken()) {
      this.oAuthService.initLoginFlow();
      return new Promise((resolve) => {
        const subscription = this.oAuthService.events.subscribe(event => {
          if (event.type === 'token_received') {
            subscription.unsubscribe();
            resolve(this.getUserInfo());
          }
        });
      });
    } else {
      return this.getUserInfo();
    }
  }

  private getUserInfo(): any {
    const claims: any = this.oAuthService.getIdentityClaims();
    if (claims) {
      return {
        email: claims.email,
        name: claims.name,
        picture: claims.picture
      };
    }
    return null;
  }

  async loginWithBackend(email: string, role: String): Promise<any> {
    try {
      return this.httpClient
        .post<any>(
          `${this.endpoint}/auth/institutional/login-google`,
          { correo: email, rol: role }
        )
        .toPromise();
    } catch (error) {
      console.error('Error during backend login:', error);
      this.logout();
      return null;
    }
  }

  hasValidToken(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  logout() {
    this.oAuthService.logOut();
  }

  getAccessToken(): string {
    return this.oAuthService.getAccessToken();
  }
}
