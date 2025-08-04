import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrRoutingModule } from './hr-routing.module';
import { HrComponent } from './hr.component';
import {UserNavbarComponent} from "../../../core/components/user-navbar/user-navbar.component";
import {SectionContentComponent} from "../../../core/components/section-content.component";
import {SubSidebarComponent} from "../../../core/components/sub-sidebar.component";
import { LayoutComponent } from "../../../core/components/layout.component";
import { SpaceSettingsComponent } from './space-settings/space-settings.component';


@NgModule({
  declarations: [
    HrComponent,
    SpaceSettingsComponent,
  ],
    imports: [
    CommonModule,
    HrRoutingModule,
    UserNavbarComponent,
    SectionContentComponent,
    SubSidebarComponent,
    LayoutComponent
]
})
export class HrModule { }
