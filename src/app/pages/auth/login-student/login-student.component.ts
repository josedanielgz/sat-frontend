import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-student',
  templateUrl: './login-student.component.html',
  styleUrls: ['./login-student.component.css'],
})
export class LoginStudentComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  subscription: Subscription = new Subscription();

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
      await this.authService.loginWithGoogle('student');
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      // Maneja el error apropiadamente (muestra un mensaje al usuario, etc.)
    } finally {
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
