import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';

// Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Request to Backend
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Redux
import { StoreModule } from '@ngrx/store';
import { combineReducer } from './app.reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment.prod';

// Routes
import { AppRoutingModule } from './app-routing.module';

// PDF
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ErrorComponent } from './pages/error/error.component';
import { ListCourseComponent } from './pages/list-course/list-course.component';
import { CourseComponent } from './pages/course/course.component';
import { ComponentsModule } from './components/components.module';
import { ProfileStudentComponent } from './pages/profile-student/profile-student.component';
import { RiskAcademicComponent } from './pages/risk-academic/risk-academic.component';
import { RiskIndividualComponent } from './pages/risk-individual/risk-individual.component';
import { RiskInstitucionalComponent } from './pages/risk-institucional/risk-institucional.component';
import { RiskEconomicComponent } from './pages/risk-economic/risk-economic.component';
import { FacultiesComponent } from './pages/faculties/faculties.component';
import { SemesterComponent } from './pages/semester/semester.component';
import { PostulateListComponent } from './pages/postulate-list/postulate-list.component';
import { InRiskComponent } from './pages/in-risk/in-risk.component';
import { ProfileTeacherComponent } from './pages/profile-teacher/profile-teacher.component';
import { SemesterWellnessComponent } from './pages/semester-wellness/semester-wellness.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { CourseDataComponent } from './pages/course-data/course-data.component';
import { InterceptorService } from './interceptor.service';
import { LoginAdminComponent } from './pages/auth/login-admin/login-admin.component';

import localeEsAr from '@angular/common/locales/es-AR';
import { LoginStudentComponent } from './pages/auth/login-student/login-student.component';
import { PermanenceInformationComponent } from './pages/permanence-information/permanence-information.component';
import { ListReportsComponent } from './pages/list-reports/list-reports.component';
import { CreateUserComponent } from './pages/create-user/create-user.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { RecoveryPasswordComponent } from './pages/auth/recovery-password/recovery-password.component';
import { AdministrativeProfileComponent } from './pages/administrative-profile/administrative-profile.component';
import { SuggestionComponent } from './pages/suggestion/suggestion.component';
import { ModalRoleComponent } from './pages/modal-role/modal-role.component';
import { ActivitiesComponent } from './pages/activities/activities.component';
import { ChatAdminComponent } from './pages/chat-admin/chat-admin.component';
import { ActivitiesStudentComponent } from './pages/activities-student/activities-student.component';
import { ProfileTeacherTeacherComponent } from './pages/profile-teacher-teacher/profile-teacher-teacher.component';
import { SemesterCoursesComponent } from './pages/semester-courses/semester-courses.component';
import { CourseBossComponent } from './pages/course-boss/course-boss.component';

registerLocaleData(localeEsAr, 'es-Ar');
PdfMakeWrapper.setFonts(pdfFonts);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorComponent,
    ListCourseComponent,
    CourseComponent,
    ProfileStudentComponent,
    RiskAcademicComponent,
    RiskIndividualComponent,
    RiskInstitucionalComponent,
    RiskEconomicComponent,
    FacultiesComponent,
    PostulateListComponent,
    InRiskComponent,
    ProfileTeacherComponent,
    SemesterComponent,
    SemesterWellnessComponent,
    ScheduleComponent,
    CourseDataComponent,
    LoginAdminComponent,
    LoginStudentComponent,
    PermanenceInformationComponent,
    ListReportsComponent,
    CreateUserComponent,
    ForgotPasswordComponent,
    RecoveryPasswordComponent,
    AdministrativeProfileComponent,
    SuggestionComponent,
    ModalRoleComponent,
    ActivitiesComponent,
    ChatAdminComponent,
    ActivitiesStudentComponent,
    ProfileTeacherTeacherComponent,
    SemesterCoursesComponent,
    CourseBossComponent,
  ],

  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    StoreModule.forRoot(combineReducer),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
    {
      provide: LOCALE_ID,
      useValue: 'es-Ar',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
