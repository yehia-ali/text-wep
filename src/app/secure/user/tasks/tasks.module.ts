import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TasksRoutingModule} from './tasks-routing.module';
import {TasksComponent} from './tasks.component';
import {MainSidebarComponent} from "../../../core/components/main-sidebar.component";
import {SubSidebarComponent} from "../../../core/components/sub-sidebar.component";
import {SectionContentComponent} from "../../../core/components/section-content.component";


@NgModule({
  
  declarations: [
    TasksComponent,
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    MainSidebarComponent,
    SubSidebarComponent,
    SectionContentComponent
  ]
})
export class TasksModule {
}
