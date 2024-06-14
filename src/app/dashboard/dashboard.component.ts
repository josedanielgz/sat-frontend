import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducers';
import { tapN } from '../helpers/observers';
import { StartLoadingAction } from '../reducer/ui/ui.actions';
import { StudentService } from '../services/student.service';
import { TeacherService } from '../services/teacher.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  loading: boolean = true;

  constructor(
    private store: Store<AppState>,
    private teacherService: TeacherService,
    private studentService: StudentService
  ) {
    this.store.dispatch(new StartLoadingAction());
    this.subscription = this.store
      .pipe(
        filter(({ auth }) => auth.user !== null),
        tapN(1, ({ auth }) => {
          if (auth.user.rol !== 'vicerrector') {
            auth.user.rol === 'estudiante'
              ? this.studentService.listCourses(
                  auth.user.codigo,
                  auth.user.ac012
                )
              : this.teacherService.listCourses(auth.user.codigo);
          }
        })
      )
      .subscribe(({ ui }) => {
        this.loading = ui.loading;
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
