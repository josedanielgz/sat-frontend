import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { showAlert } from 'src/app/helpers/alert';
import { normalizeRoles } from 'src/app/helpers/ui';
import { User } from 'src/app/model/auth';
import { Role } from 'src/app/model/role';
import { WellnessService } from 'src/app/services/wellness.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class CreateUserComponent implements OnInit {
  formCreateUser: FormGroup;
  loading: Boolean = false;
  create: Boolean = false;
  roles: Role[] = [];
  subscription: Subscription = new Subscription();

  createFormCreateUser(): FormGroup {
    return new FormGroup({
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      tipoDocumento: new FormControl('cedulaCiudadania', Validators.required),
      documento: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(10),
        Validators.pattern(/^[0-9]+$/i),
      ]),
      correo: new FormControl('', [Validators.required, Validators.email]),
      telefono: new FormControl('', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(10),
        Validators.pattern(/^[0-9]+$/i),
      ]),
      rol: new FormControl('', [Validators.required]),
    });
  }

  constructor(
    private wellnessService: WellnessService,
    private store: Store<AppState>
  ) {
    this.formCreateUser = this.createFormCreateUser();
  }

  ngOnInit(): void {
    this.subscription = this.store
      .select('role')
      .pipe(
        map(({ roles }) =>
          roles.map((role) => ({
            ...role,
            role: normalizeRoles(role.role),
          }))
        ),
        distinctUntilChanged()
      )
      .subscribe((roles) => {
        this.roles = roles;
        this.setRole(this.roles[0]._id.$oid);
      });
  }

  async onSubmit() {
    this.loading = true;
    if (!this.formCreateUser.invalid) {
      const user: User = this.formCreateUser.value;
      user.fechaingreso = new Date().toISOString();
      const res = await this.wellnessService.createUser(user);
      if (!res) showAlert('error', 'No se pudo crear la cuenta');
      else {
        showAlert('success', 'Cuenta creada con exito');
        this.formCreateUser.reset();
      }
    }
    this.loading = false;
  }

  get nombre() {
    return this.formCreateUser.get('nombre');
  }

  get apellido() {
    return this.formCreateUser.get('apellido');
  }

  get tipoDocumento() {
    return this.formCreateUser.get('tipoDocumento');
  }

  get documento() {
    return this.formCreateUser.get('documento');
  }

  get correo() {
    return this.formCreateUser.get('correo');
  }

  get telefono() {
    return this.formCreateUser.get('telefono');
  }

  get rol() {
    return this.formCreateUser.get('rol');
  }

  createRole(answer: boolean = true) {
    this.create = answer;
  }

  addRole(role) {
    this.roles = [role, ...this.roles];
  }

  setRole(role: String) {
    this.formCreateUser.get('rol').setValue(role);
  }
}
