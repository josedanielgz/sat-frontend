import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { LoginAdminComponent } from './pages/auth/login-admin/login-admin.component';
import { LoginStudentComponent } from './pages/auth/login-student/login-student.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RecoveryPasswordComponent } from './pages/auth/recovery-password/recovery-password.component';
import { ErrorComponent } from './pages/error/error.component';
import { ListReportsComponent } from './pages/list-reports/list-reports.component';
import { PublicGuard } from './guards/public.guard';
import { PrivateGuard } from './guards/private.guard';
import { PrivateLoadGuard } from './guards/private-load.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: 'docente/iniciar-sesion',
    canActivate: [PublicGuard],
    component: LoginComponent,
  },
  {
    path: 'estudiante/iniciar-sesion',
    canActivate: [PublicGuard],
    component: LoginStudentComponent,
  },
  {
    path: 'administrativo/iniciar-sesion',
    canActivate: [PublicGuard],
    component: LoginAdminComponent,
  },
  {
    path: 'auth/forgot-password',
    canActivate: [PublicGuard],
    component: ForgotPasswordComponent,
  },
  {
    path: 'auth/recovery_password/:token',
    component: RecoveryPasswordComponent,
  },
  {
    path: 'error',
    component: ErrorComponent,
  },
  {
    path: 'reportes',
    canActivate: [PrivateGuard],
    component: ListReportsComponent,
  },
  {
    path: 'docente',
    canLoad: [PrivateLoadGuard],
    loadChildren: () =>
      import('./dashboard/teacher.module').then((m) => m.TeacherModule),
  },
  {
    path: 'estudiante',
    canLoad: [PrivateLoadGuard],
    loadChildren: () =>
      import('./dashboard-student/student.module').then((m) => m.StudentModule),
  },
  {
    path: 'vicerrector',
    canLoad: [PrivateLoadGuard],
    loadChildren: () =>
      import('./dashboard-wellness/wellness.module').then(
        (m) => m.WellnessModule
      ),
  },
  {
    path: 'jefe',
    canLoad: [PrivateLoadGuard],
    loadChildren: () =>
      import('./dashboard-boss/boss.module').then((m) => m.BossModule),
  },
  {
    path: 'administrativo',
    canLoad: [PrivateLoadGuard, AdminGuard],
    loadChildren: () =>
      import('./dashboard-psychology/psychology.module').then(
        (m) => m.PsychologyModule
      ),
  },
  {
    path: '**',
    redirectTo: 'estudiante/iniciar-sesion',
  },
];

const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled',
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
