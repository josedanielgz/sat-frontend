import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { showAlert } from 'src/app/helpers/alert';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.css'],
})
export class RecoveryPasswordComponent implements OnInit, OnDestroy {
  formRecovery: FormGroup;
  loading: boolean = false;
  showPassword: boolean = false;
  typePassword: String = 'password';
  showPassword2: boolean = false;
  typePassword2: String = 'password';
  subscription: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formRecovery = this.createFormLogin();
    this.subscription = this.route.params.subscribe(({ token }) =>
      localStorage.setItem('x-token', token)
    );
  }

  createFormLogin(): FormGroup {
    return this.formBuilder.group(
      {
        newPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
        ]),
      },
      { validators: this.checkPasswords }
    );
  }

  checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let pass = group.get('newPassword').value;
    let confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notSame: true };
  };

  ngOnInit(): void {}

  changeShowPassword() {
    this.showPassword = !this.showPassword;
    this.typePassword = this.showPassword ? 'text' : 'password';
  }

  changeShowPassword2() {
    this.showPassword2 = !this.showPassword2;
    this.typePassword2 = this.showPassword2 ? 'text' : 'password';
  }

  async onSubmit() {
    this.loading = true;
    const password = this.formRecovery.value;
    delete password.confirmPassword;
    const res = await this.authService.updatePassword(password);
    if (typeof res !== 'boolean' || !res) {
      showAlert('error', 'No se pudo actualizar la contraseña');
    } else {
      localStorage.clear();
      this.router.navigate(['/administrativo/iniciar-sesion']);
      showAlert('success', 'Contraseña Actualizada');
    }
    this.loading = false;
  }

  get newPassword() {
    return this.formRecovery.get('newPassword');
  }

  get confirmPassword() {
    return this.formRecovery.get('confirmPassword');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
