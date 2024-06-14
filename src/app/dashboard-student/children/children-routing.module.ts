import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivitiesListComponent } from 'src/app/components/activities-list/activities-list.component';
import { BinnacleComponent } from 'src/app/components/binnacle/binnacle.component';
import { ChatComponent } from 'src/app/components/chat/chat.component';
import { HistoryPsichologyComponent } from 'src/app/components/history-psichology/history-psichology.component';
import { HistoryMeetComponent } from 'src/app/components/history-meet/history-meet.component';
import { InfoAcademyComponent } from 'src/app/components/info-academy/info-academy.component';
import { ListRisksComponent } from 'src/app/components/list-risks/list-risks.component';
import { MeetingComponent } from 'src/app/components/meeting/meeting.component';
import { RecordComponent } from 'src/app/components/record/record.component';
import { WellnessNotificationComponent } from 'src/app/components/wellness-notification/wellness-notification.component';
import { CourseDataComponent } from 'src/app/pages/course-data/course-data.component';
import { PermanenceInformationComponent } from 'src/app/pages/permanence-information/permanence-information.component';

import { RiskAcademicComponent } from 'src/app/pages/risk-academic/risk-academic.component';
import { RiskEconomicComponent } from 'src/app/pages/risk-economic/risk-economic.component';
import { RiskIndividualComponent } from 'src/app/pages/risk-individual/risk-individual.component';
import { RiskInstitucionalComponent } from 'src/app/pages/risk-institucional/risk-institucional.component';
import { ChildrenComponent } from './children.component';
import { HistoryClinicalComponent } from 'src/app/components/history-clinical/history-clinical.component';
import { ClinicalMeetComponent } from 'src/app/components/clinical-meet/clinical-meet.component';
import { StudentGuard } from 'src/app/guards/student.guard';

const children: Routes = [
  { path: '', component: ListRisksComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'ver-historial', component: RecordComponent },
  {
    path: 'bitacora',
    component: BinnacleComponent,
  },
  { path: 'perfil-academico', component: InfoAcademyComponent },
  { path: 'riesgo-academico', component: RiskAcademicComponent },
  { path: 'riesgo-economico', component: RiskEconomicComponent },
  { path: 'riesgo-individual', component: RiskIndividualComponent },
  { path: 'riesgo-institucional', component: RiskInstitucionalComponent },
  { path: 'actividades', component: ActivitiesListComponent },
  { path: 'historia-psicologica', component: HistoryPsichologyComponent },
  { path: 'historia-clinica', component: HistoryClinicalComponent },
  { path: 'historial-de-cita', component: HistoryMeetComponent },
  { path: 'cita-medica', component: ClinicalMeetComponent },
  { path: 'reunion', component: MeetingComponent, canActivate: [StudentGuard] },
  { path: 'notificar', component: WellnessNotificationComponent },
  { path: 'informacion-materia', component: CourseDataComponent },
  {
    path: 'informacion-permanencia',
    component: PermanenceInformationComponent,
  },
  {
    path: 'informacion-materia/:course',
    component: CourseDataComponent,
  },
];

const routes: Routes = [{ path: '', component: ChildrenComponent, children }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChildrenRoutingModule {}
