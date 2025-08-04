import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SessionsRoutingModule} from './sessions-routing.module';
import {SessionsComponent} from './sessions.component';
import {SectionContentComponent} from "../../../core/components/section-content.component";
import {SubSidebarComponent} from "../../../core/components/sub-sidebar.component";


@NgModule({
  declarations: [
    SessionsComponent
  ],
  imports: [
    CommonModule,
    SessionsRoutingModule,
    SectionContentComponent,
    SubSidebarComponent
  ]
})
export class SessionsModule {
}
