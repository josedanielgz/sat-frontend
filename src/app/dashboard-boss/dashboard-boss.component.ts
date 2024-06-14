import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducers';
import { showAlert } from '../helpers/alert';
import { tapN } from '../helpers/observers';
import { convertToRoman } from '../helpers/ui';
import { LoadSemesterAction } from '../reducer/semester/semester.actions';
import { StartLoadingAction } from '../reducer/ui/ui.actions';
import { BossService } from '../services/boss.service';
import { StudentService } from '../services/student.service';
import { TeacherService } from '../services/teacher.service';

@Component({
  selector: 'app-dashboard-boss',
  templateUrl: './dashboard-boss.component.html',
  styleUrls: ['./dashboard-boss.component.css'],
})
export class DashboardBossComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  loading: boolean = true;

  constructor(
    private store: Store<AppState>,
    private teacherService: TeacherService,
    private bossService: BossService,
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

  ngOnInit(): void {
    this.counterSemesterProgram();
  }

  async counterSemesterProgram() {
    const res = await this.bossService.counterSemesterProgram();
    if (res.ok) {
      const { semestres: total } = res.data;
      const semestersRoman = convertToRoman(total);
      const semesters = semestersRoman.map((x) => ({ nombre: x, cursos: [] }));
      this.store.dispatch(new LoadSemesterAction(semesters));
    } else {
      showAlert('error', 'Ocurrio un error');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
