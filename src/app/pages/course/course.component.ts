import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import { Title } from 'src/app/model/ui';
import { ActiveCourseAction } from 'src/app/reducer/course/course.actions';
import { LoadStatisticsAction } from 'src/app/reducer/risk/risk.action';
import { TeacherService } from 'src/app/services/teacher.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
})
export class CourseComponent implements OnInit, OnDestroy {
  title: Title = {
    title: '',
    subtitle: 'Listado de estudiantes matriculados para el semestre actual.',
  };

  subscription: Subscription = new Subscription();

  constructor(
    private uiService: UiService,
    private teacherService: TeacherService,
    private store: Store<AppState>,
    private route: ActivatedRoute
  ) {
    const code = this.route.snapshot.paramMap.get('code');
    const group = this.route.snapshot.paramMap.get('group');
    this.uiService.updateTitleNavbar('Materia');
    this.teacherService.listStudentsOfCourse(code, group);
    this.store.dispatch(new ActiveCourseAction(code));
    this.store.dispatch(
      new LoadStatisticsAction({
        code,
        group,
        risk: null,
      })
    );
  }

  ngOnInit(): void {
    this.subscription = this.store.select('course').subscribe(({ active }) => {
      if (active) {
        this.updateTitle(active.materia.nombre, active.grupo);
      }
    });
  }

  updateTitle(course: String, group: String) {
    this.title.title = `${course} - ${group.toUpperCase()}`;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
