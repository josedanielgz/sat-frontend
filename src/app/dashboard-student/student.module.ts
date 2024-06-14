import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardStudentRoutingModule } from './dashboard-student-routing.module';
import { DashboardStudentComponent } from './dashboard-student.component';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [DashboardStudentComponent],
  imports: [CommonModule, DashboardStudentRoutingModule, ComponentsModule],
})
export class StudentModule {}
