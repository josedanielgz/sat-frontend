import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { Profit } from 'src/app/model/risk';
import { StudentService } from 'src/app/services/student.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css'],
})
export class RecordComponent implements OnInit {
  risk: String = 'socioeconomico';
  codeShow: String;
  profits: Profit[] = [];
  loading: boolean = false;

  constructor(
    private uiService: UiService,
    private studentService: StudentService,
    store: Store<AppState>
  ) {
    this.uiService.updateTitleNavbar('Beneficios');
    store
      .select('ui')
      .pipe(filter(({ userActive }) => userActive !== null))
      .subscribe(({ userActive }) => (this.codeShow = userActive.codigo));
  }

  ngOnInit(): void {
    this.getProfits();
  }

  updateRisk(newRisk: String) {
    if (newRisk !== this.risk) {
      this.risk = newRisk;
      this.getProfits();
    }
  }

  async getProfits() {
    this.loading = true;
    const { data } = await this.studentService.getProfits(
      this.codeShow,
      this.risk
    );
    this.profits = data;
    this.loading = false;
  }
}
