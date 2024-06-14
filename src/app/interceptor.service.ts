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

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  constructor(private router: Router, private store: Store<AppState>) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('x-token') || '';
    const headers = new HttpHeaders().append('x-token', token);
    const reqClone = req.clone({
      headers,
    });
    return next.handle(reqClone).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        this.store.dispatch(new SetError('Ocurrio un error', '/'));
        this.router.navigate(['/error']);
        return throwError(err.message);
      })
    );
  }
}
