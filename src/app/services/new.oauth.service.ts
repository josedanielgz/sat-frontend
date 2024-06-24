import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

const authCodeFlowConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,
  clientId: '594625970943-8k5elv0om568kmfn76g8j7kbgctk67oi.apps.googleusercontent.com',
  scope: 'openid profile email https://www.googleapis.com/auth/gmail.readonly',
  showDebugInformation: !environment.production,
};

export interface UserInfo {
  info: {
    sub: string
    email: string,
    name: string,
    picture: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class NewOAuthService {
  private endpoint: string = environment.url_backend;
  userProfileSubject = new Subject<UserInfo>();

  constructor(
    private readonly oAuthService: OAuthService,
    private readonly httpClient: HttpClient,
    private router: Router
  ) {
    this.configureOAuth();
  }

  private configureOAuth() {
    this.oAuthService.configure(authCodeFlowConfig);
    this.oAuthService.logoutUrl = "https://www.google.com/accounts/Logout";

    this.oAuthService.loadDiscoveryDocument().then(() => {
      this.oAuthService.tryLoginImplicitFlow().then(() => {
        if (!this.oAuthService.hasValidAccessToken()) {
          this.oAuthService.initLoginFlow();
        } else {
          this.oAuthService.loadUserProfile().then((userProfile) => {
            this.userProfileSubject.next(userProfile as UserInfo);
          });
        }
      });
    });
  }

  async login(role: String): Promise<any> {
    if (!this.oAuthService.hasValidAccessToken()) {
      this.oAuthService.initLoginFlow();
      return new Promise((resolve) => {
        const subscription = this.userProfileSubject.subscribe(async (userProfile) => {
          subscription.unsubscribe();
          if (userProfile.info.email.endsWith('@ufps.edu.co')) {
            const loginResult = await this.loginWithBackend(userProfile.info.email, role);
            resolve(loginResult);
          } else {
            this.oAuthService.logOut();
            resolve(null);
          }
        });
      });
    } else {
      const userProfile = await this.oAuthService.loadUserProfile();
      if (userProfile['email'].endsWith('@ufps.edu.co')) {
        return this.loginWithBackend(userProfile['email'], role);
      } else {
        this.oAuthService.logOut();
        return null;
      }
    }
  }

  private async loginWithBackend(email: string, role: String): Promise<any> {
    try {
      const req = await this.httpClient
        .post<any>(
          `${this.endpoint}/auth/institutional/login-google`,
          { correo: email, rol: role }
        )
        .toPromise();

      if (req.ok) {
        return req;
      } else {
        this.oAuthService.logOut();
        return null;
      }
    } catch (error) {
      console.error('Error during backend login:', error);
      this.oAuthService.logOut();
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  logout() {
    this.oAuthService.logOut();
  }

  getAccessToken(): string {
    return this.oAuthService.getAccessToken();
  }
}
