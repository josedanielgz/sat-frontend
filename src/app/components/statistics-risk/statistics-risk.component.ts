import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter, pluck } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { showAlert } from 'src/app/helpers/alert';
import { saveInLocalStorage } from 'src/app/helpers/localStorage';
import { Statistics, StatisticsRisk } from 'src/app/model/risk';
import { RiskService } from 'src/app/services/risk.service';

@Component({
  selector: 'app-statistics-risk',
  templateUrl: './statistics-risk.component.html',
  styleUrls: ['./statistics-risk.component.css'],
})
export class StatisticsRiskComponent implements OnInit, OnDestroy {
  statistics: Statistics[] = [
    {
      type: 'Leve',
      total: 0,
    },
    {
      type: 'Moderado',
      total: 0,
    },
    {
      type: 'Crítico',
      total: 0,
    },
    {
      type: 'AC 012',
      total: 0,
    },
  ];
  loading: Boolean = true;
  subscription: Subscription = new Subscription();
  statisticsRisk: StatisticsRisk = null;

  mild: ReturnType<typeof setInterval> = null;
  moderate: ReturnType<typeof setInterval> = null;
  critical: ReturnType<typeof setInterval> = null;
  ac012: ReturnType<typeof setInterval> = null;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private riskService: RiskService
  ) {}

  ngOnInit(): void {
    this.subscription = this.store
      .select('risk')
      .pipe(
        pluck('statisticsRisk'),
        filter((statistics) => statistics !== null),
        distinctUntilChanged()
      )
      .subscribe((a) => {
        this.statisticsRisk = a;
        this.calculateStatistics();
      });
  }

  toInRisk(risk: String, total: number) {
    if (total > 0) {
      const normalizeRisk = risk
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      this.statisticsRisk = {
        ...this.statisticsRisk,
        risk: normalizeRisk,
      };
      saveInLocalStorage('statisticsRisk', this.statisticsRisk);
      this.router.navigate(['/vicerrector/en-riesgo']);
    } else {
      showAlert('warning', 'No existen estudiantes en riesgo ' + risk);
    }
  }

  async calculateStatistics() {
    const res = await this.riskService.calculateTotalStatistics(
      this.statisticsRisk
    );
    const initState = res.data.map((x) => ({ ...x, counter: 0 }));
    this.loading = false;
    if (res.ok) this.statistics = initState;
    this.mild = this.createInterval(initState, this.mild, 0);
    this.moderate = this.createInterval(initState, this.moderate, 1);
    this.critical = this.createInterval(initState, this.critical, 2);
    this.ac012 = this.createInterval(initState, this.ac012, 3);
  }

  createInterval(initState, interval, index): ReturnType<typeof setInterval> {
    return setInterval(
      () => this.animate(initState[index], interval),
      this.calculateTimer(initState[index].total)
    );
  }

  calculateTimer(total: number) {
    return 2000 / total;
  }

  getClass(type: String) {
    if (type === 'Crítico') {
      type = 'critico';
    } else if (type === 'AC 012') {
      type = 'acuerdo_012';
    }
    return type.toLowerCase();
  }

  animate(data: Statistics, interval: ReturnType<typeof setInterval>) {
    data.counter < data.total ? (data.counter += 1) : clearInterval(interval);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
