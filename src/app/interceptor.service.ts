import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppState } from './app.reducers';
import { SetError } from './reducer/ui/ui.actions';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  constructor(private router: Router, private store: Store<AppState>) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Comprueba si la solicitud es para tu API
    if (req.url.startsWith(environment.url_backend)) {
      const token = localStorage.getItem('x-token') || '';
      const headers = new HttpHeaders().append('x-token', token);
      const reqClone = req.clone({
        headers,
      });
      return next.handle(reqClone).pipe(
        catchError((err: HttpErrorResponse) => {
          this.store.dispatch(new SetError('Ocurrió un error', '/'));
          this.router.navigate(['/error']);
          return throwError(err.message);
        })
      );
    }

    // Si la solicitud no es para tu API, déjala pasar sin modificaciones
    return next.handle(req);
  }
}
