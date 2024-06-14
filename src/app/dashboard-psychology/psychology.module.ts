import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PsychologyRoutingModule } from './psychology-routing.module';
import { ComponentsModule } from '../components/components.module';
import { DashboardPsychologyComponent } from './dashboard-psychology.component';

@NgModule({
  declarations: [DashboardPsychologyComponent],
  imports: [CommonModule, PsychologyRoutingModule, ComponentsModule],
})
export class PsychologyModule {}
