import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { User } from 'src/app/model/auth';
import { Semester } from 'src/app/model/semester';
import { StudentService } from 'src/app/services/student.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-permanence-information',
  templateUrl: './permanence-information.component.html',
  styleUrls: ['./permanence-information.component.css'],
})
export class PermanenceInformationComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  user: User = null;
  semesters: Semester = null;
  loading: Boolean = true;

  constructor(
    private store: Store<AppState>,
    private studentService: StudentService,
    private uiService: UiService
  ) {
    this.uiService.updateTitleNavbar('Académico');
  }

  ngOnInit(): void {
    this.subscription = this.store
      .select('ui')
      .pipe(
        filter(({ userActive }) => userActive !== null),
        map(({ userActive }) => ({ userActive })),
        distinctUntilChanged()
      )
      .subscribe(({ userActive }) => {
        this.user = userActive;
        this.loadSemesters();
      });
  }

  async loadSemesters() {
    const { data } = await this.studentService.getSemesters('0000000');
    this.semesters = data;
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
