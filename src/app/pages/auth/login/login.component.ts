import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { Subscription } from 'rxjs';
import { GoogleService } from 'src/app/services/google.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  user: gapi.auth2.GoogleUser;
  subscription: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  isTeacher: Boolean = true;
  isBoss: Boolean = false;
  auxRole: String = 'teacher';

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
      // console.log(user);
      this.ref.detectChanges();
    });
  }

  signIn() {
    this.loading = true;
    const { protocol, host } = window.location;
    this.googleService.singIn(
      `${protocol}//${host}/docente/iniciar-sesion`,
      'teacher',
      this.auxRole
    );
  }

  changeRole(type: String = '') {
    if (type) {
      this.isTeacher = true;
      this.isBoss = false;
      this.auxRole = 'teacher';
    } else {
      this.isBoss = true;
      this.isTeacher = false;
      this.auxRole = 'boss';
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
