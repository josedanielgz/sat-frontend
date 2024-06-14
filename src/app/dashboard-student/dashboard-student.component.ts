import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducers';
import { getValueOfLocalStorage } from '../helpers/localStorage';
import { tapN } from '../helpers/observers';
import { isAdministrative } from '../helpers/ui';
import { SetUserActiveAction } from '../reducer/ui/ui.actions';
import { StudentService } from '../services/student.service';
import { TeacherService } from '../services/teacher.service';

@Component({
  selector: 'app-dashboard-student',
  templateUrl: './dashboard-student.component.html',
  styleUrls: ['./dashboard-student.component.css'],
})
export class DashboardStudentComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  loading: boolean = true;
  ac012: boolean = false;

  constructor(
    private store: Store<AppState>,
    private studentService: StudentService,
    private teacherService: TeacherService
  ) {
    this.subscription = this.store
      .pipe(
        filter(({ auth }) => auth.user !== null),
        tapN(1, ({ auth, role }) => {
          if (!isAdministrative(role.roles, auth.user.rol)) {
            auth.user.rol === 'estudiante'
              ? this.studentService.listCourses(
                  auth.user.codigo,
                  auth.user.ac012
                )
              : this.teacherService.listCourses(auth.user.codigo);
          }
        })
      )
      .subscribe(({ auth, ui }) => {
        if (auth.user.rol === 'vicerrector') this.loading = false;
        else this.loading = ui.loading;
      });
  }

  ngOnInit(): void {
    const userShow = getValueOfLocalStorage('user-show');
    this.store.dispatch(new SetUserActiveAction(userShow));
    if (userShow.rol === 'estudiante') this.ac012 = userShow.ac012;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
