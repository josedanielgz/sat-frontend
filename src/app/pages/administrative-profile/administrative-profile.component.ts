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
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { showAlert } from 'src/app/helpers/alert';
import { normalizeRoles } from 'src/app/helpers/ui';
import { User } from 'src/app/model/auth';
import { Role } from 'src/app/model/role';
import { AuthService } from 'src/app/services/auth.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-administrative-profile',
  templateUrl: './administrative-profile.component.html',
  styleUrls: ['./administrative-profile.component.css'],
})
export class AdministrativeProfileComponent implements OnInit, OnDestroy {
  userShow: User = null;
  title: String;
  user: User = null;
  showUpdateProfile: boolean = false;
  active: String = '1';
  subscription: Subscription = new Subscription();
  color: String = '';
  formChangePassword: FormGroup;
  formSchedule: FormGroup;
  showPassword: boolean = false;
  typePassword: String = 'password';
  showPassword2: boolean = false;
  typePassword2: String = 'password';
  showPassword3: boolean = false;
  typePassword3: String = 'password';
  loading: boolean = false;
  loadingSchedule: boolean = false;
  loadingData: boolean = false;
  roles: Role[] = [];

  createformSchedule(): FormGroup {
    return new FormGroup(
      {
        role: new FormControl('', Validators.required),
        morningStart: new FormControl(
          { value: '', disabled: this.loadingData },
          Validators.required
        ),
        morningEnd: new FormControl(
          { value: '', disabled: this.loadingData },
          Validators.required
        ),
        afternoonStart: new FormControl(
          { value: '', disabled: this.loadingData },
          Validators.required
        ),
        afternoonEnd: new FormControl(
          { value: '', disabled: this.loadingData },
          Validators.required
        ),
      },
      { validators: this.checkTimes }
    );
  }

  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private uiService: UiService
  ) {
    this.formChangePassword = this.createFormLogin();
    this.formSchedule = this.createformSchedule();
    this.uiService.updateTitleNavbar('Perfil');
    const colors: String[] = ['gray', 'blue', 'green', 'purple', 'orange'];
    this.color = `${colors[Math.floor(Math.random() * (5 + 0 - 0) + 0)]}-color`;
  }

  ngOnInit(): void {
    this.subscription = this.store
      .pipe(
        filter(({ auth }) => auth.user !== null),
        distinctUntilChanged()
      )
      .subscribe(({ auth, role }) => {
        this.user = auth.user;
        this.roles = role.roles;
        this.setRole(this.roles[0]._id.$oid);
        this.change();
      });
  }

  setRole(role: String) {
    this.formSchedule.get('role').setValue(role);
  }

  createFormLogin(): FormGroup {
    return this.formBuilder.group(
      {
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
        ]),
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
    const pass = group.get('newPassword').value;
    const confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notSame: true };
  };

  checkTimes: ValidatorFn = (group: AbstractControl) => {
    const morningStart = group.get('morningStart').value;
    const morningEnd = group.get('morningEnd').value;
    const afternoonStart = group.get('afternoonStart').value;
    const afternoonEnd = group.get('afternoonEnd').value;
    const validateAM = this.onlyAM(morningStart) && this.onlyAM(morningEnd);
    const validatePM = this.onlyPM(afternoonStart) && this.onlyPM(afternoonEnd);
    const validateMorning = `${morningStart}:00` < `${morningEnd}:00`;
    const validateAfternoon = `${afternoonStart}:00` < `${afternoonEnd}:00`;
    return validateAM && validatePM && validateMorning && validateAfternoon
      ? null
      : { notSame: true };
  };

  onlyAM(hour: String) {
    hour = `${hour}:00`;
    return hour >= '06:00:00' && hour <= '12:00:00';
  }

  onlyPM(hour: String) {
    hour = `${hour}:00`;
    return hour >= '13:00:00' && hour <= '18:00:00';
  }

  showActive(state) {
    if (state !== this.active) {
      this.active = state;
    }
  }

  normalize(role: String) {
    return normalizeRoles(role);
  }

  async onSubmit() {
    if (!this.formChangePassword.invalid) {
      const password = {
        ...this.formChangePassword.value,
        id: this.user._id,
      };
      delete password.confirmPassword;
      const res = await this.authService.changePassword(password);
      if (!res) {
        showAlert('error', 'No se pudo cambiar la contraseña');
      } else {
        showAlert('success', 'Contraseña actualizada');
        this.authService.logout('vicerrector');
      }
    }
    this.loading = false;
  }

  async updateSchedule() {
    this.loadingSchedule = true;
    if (!this.formSchedule.invalid) {
      const schedule = this.formSchedule.value;
      const res = await this.authService.updateSchedule(schedule);
      res.ok && showAlert('success', res.msg);
    }
    this.loadingSchedule = false;
  }

  changeShowPassword() {
    this.showPassword = !this.showPassword;
    this.typePassword = this.showPassword ? 'text' : 'password';
  }

  changeShowPassword2() {
    this.showPassword2 = !this.showPassword2;
    this.typePassword2 = this.showPassword2 ? 'text' : 'password';
  }

  changeShowPassword3() {
    this.showPassword3 = !this.showPassword3;
    this.typePassword3 = this.showPassword3 ? 'text' : 'password';
  }

  async change() {
    this.loadingData = true;
    const role = this.formSchedule.get('role').value;
    const res = await this.authService.getSchedule(role);
    const { morningStart, morningEnd, afternoonStart, afternoonEnd } = res;
    this.formSchedule.get('morningStart').setValue(morningStart);
    this.formSchedule.get('morningEnd').setValue(morningEnd);
    this.formSchedule.get('afternoonStart').setValue(afternoonStart);
    this.formSchedule.get('afternoonEnd').setValue(afternoonEnd);
    this.loadingData = false;
  }

  get password() {
    return this.formChangePassword.get('password');
  }

  get newPassword() {
    return this.formChangePassword.get('newPassword');
  }

  get confirmPassword() {
    return this.formChangePassword.get('confirmPassword');
  }

  get morningStart() {
    return this.formSchedule.get('morningStart');
  }

  get afternoonStart() {
    return this.formSchedule.get('afternoonStart');
  }
  get morningEnd() {
    return this.formSchedule.get('morningEnd');
  }

  get afternoonEnd() {
    return this.formSchedule.get('afternoonEnd');
  }

  get role() {
    return this.formSchedule.get('role');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
