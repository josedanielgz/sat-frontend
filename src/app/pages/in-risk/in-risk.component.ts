import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { getValueOfLocalStorage } from 'src/app/helpers/localStorage';
import { capitalizeText } from 'src/app/helpers/ui';
import { StatisticsRisk } from 'src/app/model/risk';
import { Title } from 'src/app/model/ui';
import {
  DesactiveCourseAction,
  LoadStudentsAction,
} from 'src/app/reducer/course/course.actions';
import { RiskService } from 'src/app/services/risk.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-in-risk',
  templateUrl: './in-risk.component.html',
  styleUrls: ['./in-risk.component.css'],
})
export class InRiskComponent implements OnInit {
  title: Title = {
    title: 'Cargando...',
    subtitle: '',
  };

  constructor(
    private uiService: UiService,
    private riskService: RiskService,
    private store: Store<AppState>
  ) {
    this.uiService.updateTitleNavbar('En Riesgo');
    this.store.dispatch(new DesactiveCourseAction());
  }

  ngOnInit(): void {
    const statisticsRisk: StatisticsRisk =
      getValueOfLocalStorage('statisticsRisk');
    const risk = capitalizeText(statisticsRisk.risk);
    this.title = {
      ...this.title,
      title: `Riesgo ${risk}`,
    };
    this.getStudentsInRisk(statisticsRisk);
  }

  async getStudentsInRisk(statisticsRisk) {
    const res = await this.riskService.getStudentsInRisk(statisticsRisk);
    if (res.ok)
      this.store.dispatch(
        new LoadStudentsAction({ students: res.data, totalPages: 1 })
      );
  }
}
