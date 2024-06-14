import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { AppState } from '../app.reducers';
import { showAlert } from '../helpers/alert';
import { saveInLocalStorage } from '../helpers/localStorage';
import { AddUserAction } from '../reducer/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class GoogleService {
  endpoint: String = environment.url_backend;
  auth2: gapi.auth2.GoogleAuth;
  withOutToken: HttpClient;
  subject = new ReplaySubject<gapi.auth2.GoogleUser>(1);

  constructor(
    private httpBackend: HttpBackend,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.withOutToken = new HttpClient(this.httpBackend);
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id:
          '849909275151-7onvmmdg7shcn58f59i3tldn2fbkn58q.apps.googleusercontent.com',
      });
    });
  }

  async singIn(redirect_uri: string, rol: String, type?: String) {
    try {
      const user = await this.auth2.signIn({
        scope: 'https://www.googleapis.com/auth/gmail.readonly',
        prompt: 'consent',
        redirect_uri,
      });
      const emailAux =
        type === 'teacher'
          ? // ? 'matiashc@ufps.edu.co'
            'juancarlosso@ufps.edu.co'
          : 'judithdelpilarrt@ufps.edu.co';
      const correo = user.getBasicProfile().getEmail();
      const domine = correo.split('@')[1];
      if (domine === 'ufps.edu.co') {
        const userAuth = {
          correo: rol === 'student' ? correo : emailAux,
          rol,
        };
        const res = await this.loginGoogle(userAuth, 'institutional');
        if (res.ok) {
          localStorage.setItem('x-token', res.token.toString());
          showAlert('success', res.msg);
          this.store.dispatch(new AddUserAction(res.data));
          saveInLocalStorage('user-show', res.data);
          this.router.navigate([`/${res.data.rol.toLowerCase()}`]);
        } else {
          showAlert('error', res.msg);
          this.singOut();
        }
        this.subject.next(user);
      } else {
        showAlert(
          'error',
          'Debe ingresar con el correo institucional de la UFPS'
        );
        this.singOut();
      }
    } catch (error) {
      console.error(error);
      this.subject.next(null);
    }
  }

  async loginGoogle(dataLoginGoogle: any, typeUser: String) {
    try {
      const req = await this.withOutToken
        .post<any>(
          this.endpoint + '/auth/' + typeUser + '/login-google',
          dataLoginGoogle
        )
        .toPromise();
      return req;
    } catch (error) {
      console.error(error);
    }
  }

  async singOut() {
    await this.auth2.signOut();
    this.subject.next(null);
  }

  observable(): Observable<gapi.auth2.GoogleUser> {
    return this.subject.asObservable();
  }
}
