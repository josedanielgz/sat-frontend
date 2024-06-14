import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import { GoogleService } from 'src/app/services/google.service';

@Component({
  selector: 'app-login-student',
  templateUrl: './login-student.component.html',
  styleUrls: ['./login-student.component.css'],
})
export class LoginStudentComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  user: gapi.auth2.GoogleUser;
  subscription: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();

  constructor(
    private googleService: GoogleService,
    private ref: ChangeDetectorRef,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.subscription = this.store
      .select('ui')
      .subscribe(({ loading }) => (this.loading = loading));
    this.subscription2 = this.googleService.observable().subscribe((user) => {
      this.user = user;
      if (!this.user) {
        this.loading = false;
      }
      this.ref.detectChanges();
    });
  }

  signIn() {
    this.loading = true;
    const { protocol, host } = window.location;
    this.googleService.singIn(
      `${protocol}//${host}/estudiante/iniciar-sesion`,
      'student'
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
