import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import {SectionContentComponent} from "../../../core/components/section-content.component";
import {SubSidebarComponent} from "../../../core/components/sub-sidebar.component";


@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SectionContentComponent,
    SubSidebarComponent
  ]
})
export class ReportsModule { }
