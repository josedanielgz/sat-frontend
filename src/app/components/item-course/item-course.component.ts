import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { saveInLocalStorage } from 'src/app/helpers/localStorage';
import { User } from 'src/app/model/auth';
import { Course } from 'src/app/model/course';
import { ActiveCourseAction } from 'src/app/reducer/course/course.actions';
import {
  FinishLoadingAction,
  StartLoadingAction,
} from 'src/app/reducer/ui/ui.actions';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-item-course',
  templateUrl: './item-course.component.html',
  styleUrls: ['./item-course.component.css'],
})
export class ItemCourseComponent implements OnInit, OnDestroy {
  @Input() course: Course;

  user: User = null;
  subscription: Subscription = new Subscription();
  title: String;

  constructor(
    private studentService: StudentService,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.store
      .pipe(
        filter(({ auth }) => auth.user !== null),
        map(({ auth, ui }) => ({
          title: ui.titleNavbar,
          user: auth.user,
        }))
      )
      .subscribe(({ user, title }) => {
        this.user = user;
        this.title = title;
      });
  }

  async navigateToTeacher() {
    if (!this.course.materia.ac012) {
      this.store.dispatch(new StartLoadingAction());
      if (this.title === 'Académico') {
        this.store.dispatch(new ActiveCourseAction(this.course.materia.codigo));
        this.router.navigate([
          `/estudiante/informacion-materia/${this.course.materia.codigo}`,
        ]);
      } else if (this.user.rol === 'docente' || this.user.rol === 'jefe') {
        this.router.navigate([
          `/docente/materia/${this.course.materia.codigo}/${this.course.grupo}`,
        ]);
      } else {
        const { data } = await this.studentService.getTeacherOfCourse(
          this.course.docente
        );
        saveInLocalStorage('user-show', data);
        this.router.navigate([`/docente/perfil/${this.course.docente}`]);
      }
      this.store.dispatch(new FinishLoadingAction());
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
