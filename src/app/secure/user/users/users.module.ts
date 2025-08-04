import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import {SectionContentComponent} from "../../../core/components/section-content.component";
import {SubSidebarComponent} from "../../../core/components/sub-sidebar.component";


@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SectionContentComponent,
    SubSidebarComponent
  ]
})
export class UsersModule { }
