import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { getValueOfLocalStorage } from 'src/app/helpers/localStorage';
import { Course } from 'src/app/model/course';
import { Note } from 'src/app/model/ui';
import {
  ActiveCourseAction,
  LoadingCourseAction,
} from 'src/app/reducer/course/course.actions';
import { StudentService } from 'src/app/services/student.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-course-data',
  templateUrl: './course-data.component.html',
  styleUrls: ['./course-data.component.css'],
})
export class CourseDataComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  course: Course = null;
  docente: String = 'Cargando...';
  codigo: String = '';
  loading: boolean = true;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private uiService: UiService,
    private studentService: StudentService
  ) {
    this.uiService.updateTitleNavbar('Académico');
    this.load();
    this.route.params.subscribe(({ course }) => {
      this.codigo = course;
      this.store.dispatch(new ActiveCourseAction(course));
    });
  }

  ngOnInit(): void {
    this.subscription = this.store
      .select('course')
      .pipe(
        tap(async ({ active }) => {
          if (active) {
            const {
              data: { nombre, apellido },
            } = await this.studentService.getTeacherOfCourse(active.docente);
            this.docente = `${nombre} ${apellido}`;
          }
        })
      )
      .subscribe(({ active }) => {
        if (active) this.course = active;
      });
  }

  createNote(name: String, note: Number): Note {
    let color = '';
    if (!note) color = 'empty';
    if (note < 3) color = 'bad';
    else if (note >= 3 && note < 4) color = 'regular';
    else if (note >= 4) color = 'good';
    return {
      name,
      note,
      color,
    };
  }

  async load() {
    const user = getValueOfLocalStorage('user-show');
    const { data } = await this.studentService.getCourses(user.codigo);
    this.store.dispatch(new LoadingCourseAction(data));
    this.store.dispatch(new ActiveCourseAction(this.codigo));
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
