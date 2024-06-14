import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BossGuard } from '../guards/boss.guard';
import { SemesterComponent } from '../pages/semester/semester.component';
import { DashboardBossComponent } from './dashboard-boss.component';
import { SemesterCoursesComponent } from '../pages/semester-courses/semester-courses.component';
import { CourseBossComponent } from '../pages/course-boss/course-boss.component';

const children: Routes = [
  { path: '', component: SemesterComponent },
  {
    path: 'semestres-courses',
    component: SemesterCoursesComponent,
  },
  {
    path: 'informe-curso/:code/:group',
    component: CourseBossComponent,
  },
];

const routes: Routes = [
  {
    path: '',
    component: DashboardBossComponent,
    canActivate: [BossGuard],
    children,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BossRoutingModule {}
