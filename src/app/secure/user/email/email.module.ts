import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailRoutingModule } from './email-routing.module';
import { EmailComponent } from './email.component';
import {SectionContentComponent} from "../../../core/components/section-content.component";
import {SubSidebarComponent} from "../../../core/components/sub-sidebar.component";


@NgModule({
  declarations: [
    EmailComponent
  ],
  imports: [
    CommonModule,
    EmailRoutingModule,
    SectionContentComponent,
    SubSidebarComponent
  ]
})
export class EmailModule { }
