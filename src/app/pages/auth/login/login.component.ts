import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  subscription: Subscription = new Subscription();
  isTeacher: Boolean = true;
  isBoss: Boolean = false;
  auxRole: String = 'teacher';

  constructor(
    private authService: AuthService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.subscription = this.store
      .select('ui')
      .subscribe(({ loading }) => (this.loading = loading));
  }

  async signIn() {
    try {
      this.loading = true;
      await this.authService.loginWithGoogle(this.auxRole);
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      // Maneja el error apropiadamente (muestra un mensaje al usuario, etc.)
    } finally {
      this.loading = false;
    }
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
  }
}
