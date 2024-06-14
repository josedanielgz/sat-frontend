import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { showAlert } from 'src/app/helpers/alert';
import { Role, RoleSchedule } from '../../model/role';
import { AuthService } from 'src/app/services/auth.service';
import { normalizeRoles } from 'src/app/helpers/ui';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { AddRoleAction } from 'src/app/reducer/role/role.action';

@Component({
  selector: 'app-modal-role',
  templateUrl: './modal-role.component.html',
  styleUrls: ['./modal-role.component.css'],
})
export class ModalRoleComponent implements OnInit {
  @Output() isClosed = new EventEmitter<boolean>();
  formRole: FormGroup;
  loading: Boolean = false;

  createFormRole(): FormGroup {
    return new FormGroup(
      {
        role: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[a-z]/i),
        ]),
        morningStart: new FormControl('08:00', Validators.required),
        morningEnd: new FormControl('12:00', Validators.required),
        afternoonStart: new FormControl('14:00', Validators.required),
        afternoonEnd: new FormControl('18:00', Validators.required),
      },
      { validators: this.checkTimes }
    );
  }

  constructor(
    private authService: AuthService,
    private store: Store<AppState>
  ) {
    this.formRole = this.createFormRole();
  }

  ngOnInit(): void {}

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

  close() {
    this.isClosed.emit(false);
  }

  convert() {
    const text = this.formRole.get('role').value;
    const normalizeText = text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .split(' ');
    const camelCase = normalizeText
      .map((word, i) =>
        i > 0 ? `${word.charAt(0).toUpperCase()}${word.slice(1)}` : word
      )
      .join('');
    this.formRole.get('role').setValue(camelCase);
  }

  async onSubmit() {
    this.loading = true;
    this.convert();
    const role = this.formRole.get('role').value;
    let schedule = this.formRole.value;
    delete schedule.role;
    const roleData: RoleSchedule = { role, schedule };
    const res = await this.authService.createRole(roleData);
    if (res.ok) {
      showAlert('success', 'El rol fue creado exitosamente');
      const role: Role = {
        _id: {
          $oid: res.data._id,
        },
        role: res.data.role,
      };
      this.store.dispatch(new AddRoleAction(role));
      this.close();
    } else {
      this.formRole.reset();
      showAlert('error', 'El rol ya existe');
    }
    this.loading = false;
  }

  onClick({ target }) {
    if (target.className === 'wrapper_alert') {
      this.close();
    }
  }

  get morningStart() {
    return this.formRole.get('morningStart');
  }

  get afternoonStart() {
    return this.formRole.get('afternoonStart');
  }

  get morningEnd() {
    return this.formRole.get('morningEnd');
  }

  get afternoonEnd() {
    return this.formRole.get('afternoonEnd');
  }

  get role() {
    return this.formRole.get('role');
  }
}
