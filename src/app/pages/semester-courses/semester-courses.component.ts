import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, map, pluck } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { showAlert } from 'src/app/helpers/alert';
import { SemesterBoss } from 'src/app/model/semester';
import {
  SetCourseSemesterAction,
  SetGroupsSemesterAction,
  SetLoadingAction,
  UnsetLoadingAction,
} from 'src/app/reducer/semester/semester.actions';
import { BossService } from 'src/app/services/boss.service';

@Component({
  selector: 'app-semester-courses',
  templateUrl: './semester-courses.component.html',
  styleUrls: ['./semester-courses.component.css'],
})
export class SemesterCoursesComponent implements OnInit, OnDestroy {
  semesters: SemesterBoss[] = [];
  subscription: Subscription = new Subscription();
  current: number | string = '';
  loading: boolean = false;
  index: number = 0;

  constructor(
    private bossService: BossService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.subscription = this.store
      .select('semester')
      .pipe(
        pluck('semesters'),
        filter((x) => x.length > 0),
        map((x) =>
          x.map((y) => ({
            ...y,
            cursos: y.cursos.map((z) => ({ ...z, showGroup: false })),
          }))
        )
      )
      .subscribe((semesters) => (this.semesters = semesters));
  }

  async showSemesterCourse(e) {
    this.loading = true;
    const semester = parseInt(e.target.value);
    this.index = semester - 1;
    if (!this.semesters[this.index].cursos.length) {
      const res = await this.bossService.showSemesterCourses(semester);
      res.ok &&
        this.store.dispatch(new SetCourseSemesterAction(res.data, semester));
    }
    this.current = semester;
    this.loading = false;
  }

  async showCoursesGroups(semester: number, course: number, codigo: String) {
    if (!this.semesters[semester].cursos[course].grupos.length) {
      this.store.dispatch(new SetLoadingAction(course, semester));
      const codeProgram = codigo.slice(0, -4);
      const codeCourse = codigo.slice(-4);
      const res = await this.bossService.showCoursesGroups(
        codeProgram,
        codeCourse
      );
      if (res.ok) {
        this.store.dispatch(
          new SetGroupsSemesterAction(res.data, course, semester)
        );
      } else {
        showAlert('warning', res.msg);
      }
      this.store.dispatch(new UnsetLoadingAction(course, semester));
    }
  }

  async toggleShow(indexCourse: number, code: String) {
    await this.showCoursesGroups(this.index, indexCourse, code);
    this.updateAtribute(indexCourse, 'showGroup');
  }

  updateAtribute(i: number, key: string) {
    this.semesters[this.index].cursos[i][key] =
      !this.semesters[this.index].cursos[i][key];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
