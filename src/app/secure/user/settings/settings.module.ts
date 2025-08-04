import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import {SectionContentComponent} from "../../../core/components/section-content.component";
import {SubSidebarComponent} from "../../../core/components/sub-sidebar.component";


@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SectionContentComponent,
    SubSidebarComponent
  ]
})
export class SettingsModule { }
