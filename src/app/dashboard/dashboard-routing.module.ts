import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseComponent } from '../pages/course/course.component';
import { ListCourseComponent } from '../pages/list-course/list-course.component';
import { ProfileTeacherComponent } from '../pages/profile-teacher/profile-teacher.component';
import { ProfileTeacherTeacherComponent } from '../pages/profile-teacher-teacher/profile-teacher-teacher.component';
import { DashboardComponent } from './dashboard.component';
import { InstitutionalGuard } from '../guards/institutional.guard';
import { TeacherGuard } from '../guards/teacher.guard';
import { StudentGuard } from '../guards/student.guard';

const children: Routes = [
  {
    path: '',
    canActivate: [InstitutionalGuard],
    component: ListCourseComponent,
  },
  {
    path: 'materia/:code/:group',
    canActivate: [TeacherGuard],
    component: CourseComponent,
  },
  {
    path: 'perfil/:code',
    canActivate: [StudentGuard],
    component: ProfileTeacherComponent,
  },
  {
    path: 'perfil',
    canActivate: [TeacherGuard],
    component: ProfileTeacherTeacherComponent,
  },
];
const routes: Routes = [{ path: '', component: DashboardComponent, children }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
