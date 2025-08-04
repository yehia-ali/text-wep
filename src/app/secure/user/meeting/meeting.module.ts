import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeetingRoutingModule } from './meeting-routing.module';
import { MeetingComponent } from './meeting.component';
import {SectionContentComponent} from "../../../core/components/section-content.component";
import {SubSidebarComponent} from "../../../core/components/sub-sidebar.component";


@NgModule({
  declarations: [
    MeetingComponent
  ],
    imports: [
        CommonModule,
        MeetingRoutingModule,
        SectionContentComponent,
        SubSidebarComponent
    ]
})
export class MeetingModule { }
