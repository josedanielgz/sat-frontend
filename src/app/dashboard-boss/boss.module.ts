import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BossRoutingModule } from './boss-routing.module';
import { DashboardBossComponent } from './dashboard-boss.component';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [DashboardBossComponent],
  imports: [CommonModule, BossRoutingModule, ComponentsModule],
})
export class BossModule {}
