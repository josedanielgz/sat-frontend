import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UiService } from 'src/app/services/ui.service';
import { WellnessService } from 'src/app/services/wellness.service';
import { Facultie } from 'src/app/model/wellness';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { LoadStatisticsAction } from 'src/app/reducer/risk/risk.action';

@Component({
  selector: 'app-faculties',
  templateUrl: './faculties.component.html',
  styleUrls: ['./faculties.component.css'],
})
export class FacultiesComponent implements OnInit {
  faculties: Facultie[] = [];
  loading: boolean = true;

  constructor(
    private uiService: UiService,
    private router: Router,
    private wellnessService: WellnessService,
    private store: Store<AppState>
  ) {
    this.uiService.updateTitleNavbar('Facultades');
  }

  ngOnInit(): void {
    this.store.dispatch(
      new LoadStatisticsAction({
        global: true,
        risk: null,
      })
    );
    this.getFaculties();
  }

  async getFaculties() {
    const { data } = await this.wellnessService.getFaculties();
    this.faculties = data;
    this.loading = false;
  }

  goToInRisk() {
    this.router.navigate(['/vicerrector/en-riesgo']);
  }
}
