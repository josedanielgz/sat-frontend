import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { User } from 'src/app/model/auth';
import { risks } from 'src/app/model/data';
import { Risk, RiskUFPS } from 'src/app/model/risk';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-list-risks',
  templateUrl: './list-risks.component.html',
  styleUrls: ['./list-risks.component.css'],
})
export class ListRisksComponent implements OnInit {
  showAlert: boolean = false;
  risksDetail: Risk[] = risks;

  user: User = null;
  subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private uiService: UiService,
    private store: Store<AppState>
  ) {
    this.uiService.updateTitleNavbar('Perfil');
  }

  ngOnInit(): void {
    this.subscription = this.store
      .pipe(
        filter(({ risk }) => risk.risks.length > 0),
        map(({ auth, risk }) => ({ auth, risk })),
        distinctUntilChanged()
      )
      .subscribe(({ auth: { user }, risk: { risks } }) => {
        this.user = user;
        this.getRisks(risks);
      });
  }

  onNavigateToRisk(url: String) {
    this.router.navigate([url]);
  }

  updateRisk(show: boolean = true) {
    if (show && this.user.rol === 'vicerrector') {
      this.showAlert = show;
    } else {
      this.showAlert = false;
    }
  }

  getRisks(risks: RiskUFPS[]) {
    this.risksDetail = this.risksDetail.map((risk) => {
      risk.riskGlobal = risks.find(
        ({ nombre }) => nombre === risk.name
      ).puntaje;
      return risk;
    });
  }
}
