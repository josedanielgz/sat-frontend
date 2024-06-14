import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WellnessRoutingModule } from './wellness-routing.module';
import { DashboardWellnessComponent } from './dashboard-wellness.component';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [DashboardWellnessComponent],
  imports: [CommonModule, WellnessRoutingModule, ComponentsModule],
})
export class WellnessModule {}
