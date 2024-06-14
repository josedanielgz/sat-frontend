import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentGuard } from '../guards/student.guard';
import { ActivitiesStudentComponent } from '../pages/activities-student/activities-student.component';
import { ChatAdminComponent } from '../pages/chat-admin/chat-admin.component';
import { DashboardStudentComponent } from './dashboard-student.component';

const children: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./children/children.module').then((m) => m.ChildrenModule),
  },
  {
    path: 'listado-actividades',
    canActivate: [StudentGuard],
    component: ActivitiesStudentComponent,
  },
  {
    path: 'chat-admin/:document',
    component: ChatAdminComponent,
  },
  { path: '**', redirectTo: '' },
];

const routes: Routes = [
  {
    path: '',
    component: DashboardStudentComponent,
    children,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardStudentRoutingModule {}
