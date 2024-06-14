import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { showAlert } from 'src/app/helpers/alert';
import { generatePDF } from 'src/app/helpers/pdf';
import { createReportBinnacle } from 'src/app/helpers/report';
import { isAdministrative, normalizeRoles } from 'src/app/helpers/ui';
import { Binnacle } from 'src/app/model/administrative';
import { User } from 'src/app/model/auth';
import { Router } from '@angular/router';
import { BinnacleService } from 'src/app/services/binnacle.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-binnacle',
  templateUrl: './binnacle.component.html',
  styleUrls: ['./binnacle.component.css'],
})
export class BinnacleComponent implements OnInit, OnDestroy {
  binnacle: Binnacle[] = [];
  userShow: User = null;
  subscription: Subscription = new Subscription();
  role: String = '';
  code: String = '';
  formBinnacle: FormGroup;
  show: Boolean = false;
  loading: Boolean = false;
  isAdmin: Boolean = false;

  createFormBinnacle(): FormGroup {
    return new FormGroup({
      text: new FormControl('', Validators.required),
    });
  }

  constructor(
    private uiService: UiService,
    private router: Router,
    private binnacleService: BinnacleService,
    private store: Store<AppState>
  ) {
    this.formBinnacle = this.createFormBinnacle();
    this.uiService.updateTitleNavbar('Bitacora');
  }

  ngOnInit(): void {
    this.subscription = this.store
      .pipe(
        filter(({ ui, auth }) => auth.user !== null && ui.userActive !== null),
        tap(({ ui }) => (this.userShow = ui.userActive)),
        map(({ ui, auth, role }) => ({
          code: ui.userActive.codigo,
          role: auth.user.rol,
          isAdmin: isAdministrative(role.roles, auth.user.rol) ? true : false,
        }))
      )
      .subscribe(({ code, role, isAdmin }) => {
        this.role = role;
        this.code = code;
        this.isAdmin = isAdmin;
        this.loadBinnacle();
      });
  }

  async loadBinnacle() {
    const binnacle = await this.binnacleService.getBinnacle(this.code);
    this.binnacle = binnacle;
  }

  async onSubmit() {
    this.loading = true;
    if (!this.formBinnacle.invalid) {
      const binnacle: Binnacle = {
        text: this.formBinnacle.get('text').value,
        role: this.role.toString(),
        student: this.code,
        date: new Date().toISOString(),
      };
      const data = await this.binnacleService.toWriter(binnacle);
      if (data.ok) {
        this.binnacle = [data.data, ...this.binnacle];
      } else {
        showAlert('error', 'Algo salio mal');
      }
      this.formBinnacle.reset();
      this.show = false;
    }
    this.loading = false;
  }

  normalize(role: String) {
    return normalizeRoles(role);
  }

  toggleShow() {
    this.show = !this.show;
    if (this.show) {
      this.router.navigate(['/estudiante/bitacora'], { fragment: 'toForm' });
    } else {
      this.router.navigate(['/estudiante/bitacora']);
    }
  }

  download() {
    if (this.binnacle.length < 1) {
      showAlert('warning', 'No hay nada para descargar');
    } else {
      const msg = `Historial del seguimiento realizado al estudiante ${this.userShow.nombre} ${this.userShow.apellido} en el sistema de alertas de la UFPS`;
      generatePDF(this.binnacle, msg, createReportBinnacle);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
