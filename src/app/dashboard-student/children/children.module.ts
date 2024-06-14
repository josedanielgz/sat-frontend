import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChildrenRoutingModule } from './children-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { ChildrenComponent } from './children.component';

@NgModule({
  declarations: [ChildrenComponent],
  imports: [CommonModule, ChildrenRoutingModule, ComponentsModule],
})
export class ChildrenModule {}
