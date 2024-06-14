import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseDataComponent } from '../pages/course-data/course-data.component';
import { CreateUserComponent } from '../pages/create-user/create-user.component';
import { FacultiesComponent } from '../pages/faculties/faculties.component';
import { InRiskComponent } from '../pages/in-risk/in-risk.component';
import { PostulateListComponent } from '../pages/postulate-list/postulate-list.component';
import { SemesterWellnessComponent } from '../pages/semester-wellness/semester-wellness.component';
import { SemesterComponent } from '../pages/semester/semester.component';
import { SuggestionComponent } from '../pages/suggestion/suggestion.component';
import { DashboardWellnessComponent } from './dashboard-wellness.component';
import { ActivitiesComponent } from '../pages/activities/activities.component';
import { WellnessGuard } from '../guards/wellness.guard';
import { BossGuard } from '../guards/boss.guard';

const children: Routes = [
  { path: '', component: FacultiesComponent },
  {
    path: 'semestres/programa/:nombre',
    canActivate: [WellnessGuard],
    component: SemesterComponent,
  },
  {
    path: 'semestre/:programa/:numero',
    canActivate: [WellnessGuard],
    component: SemesterWellnessComponent,
  },
  {
    path: 'postulados/:pagina',
    component: PostulateListComponent,
  },
  { path: 'en-riesgo', component: InRiskComponent },
  { path: 'datos-curso', component: CourseDataComponent },
  {
    path: 'facultades',
    component: FacultiesComponent,
  },
  {
    path: 'crear-usuario',
    canActivate: [WellnessGuard],
    component: CreateUserComponent,
  },
  {
    path: 'sugerencias',
    canActivate: [WellnessGuard],
    component: SuggestionComponent,
  },
  {
    path: 'sugerencias/:pagina',
    canActivate: [WellnessGuard],
    component: SuggestionComponent,
  },
  {
    path: 'actividades',
    canActivate: [WellnessGuard],
    component: ActivitiesComponent,
  },
];

const routes: Routes = [
  { path: '', component: DashboardWellnessComponent, children },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WellnessRoutingModule {}
