import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import { UserAuth } from 'src/app/model/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css'],
})
export class LoginAdminComponent implements OnInit, OnDestroy {
  formLogin: FormGroup;
  showPassword: boolean = false;
  typePassword: String = 'password';
  typeDocument: String = 'password';
  loading: boolean = false;
  subscription: Subscription = new Subscription();

  createFormLogin(): FormGroup {
    return new FormGroup({
      // document: new FormControl('1093765466', [
      // document: new FormControl('77012419', [ Odontologo
      document: new FormControl('1090494143', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(10),
        Validators.pattern(/^[0-9]+$/i),
      ]),
      // password: new FormControl('7961', [
      // password: new FormControl('8327', [ Odontologo
      password: new FormControl('2585', [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }

  constructor(
    private authService: AuthService,
    private store: Store<AppState>
  ) {
    this.formLogin = this.createFormLogin();
  }

  ngOnInit(): void {
    this.subscription = this.store
      .select('ui')
      .subscribe(({ loading }) => (this.loading = loading));
  }

  changeShowPassword() {
    this.showPassword = !this.showPassword;
    this.typePassword = this.showPassword ? 'text' : 'password';
  }

  changeTypeDocument(option: boolean) {
    option ? (this.typeDocument = 'text') : (this.typeDocument = 'password');
  }

  onSubmit() {
    if (!this.formLogin.invalid) {
      const user: UserAuth = this.formLogin.value;
      this.authService.login(user, 'administrative');
    }
  }

  get document() {
    return this.formLogin.get('document');
  }

  get password() {
    return this.formLogin.get('password');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
