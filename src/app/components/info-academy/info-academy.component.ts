import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { User } from 'src/app/model/auth';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-info-academy',
  templateUrl: './info-academy.component.html',
  styleUrls: ['./info-academy.component.css'],
})
export class InfoAcademyComponent implements OnInit, OnDestroy {
  user: User;
  subscription: Subscription = new Subscription();

  constructor(
    private uiService: UiService,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.store
      .pipe(filter(({ auth }) => auth.user !== null))
      .subscribe(({ auth: { user }, ui: { userActive } }) =>
        user.rol === 'estudiante'
          ? (this.user = user)
          : (this.user = userActive)
      );
    this.uiService.updateTitleNavbar('Académico');
  }

  onNavigateToCourseData() {
    this.router.navigate(['/vicerrector/datos-curso']);
  }

  onNavigatePermanence() {
    this.router.navigate(['/estudiante/informacion-permanencia']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
