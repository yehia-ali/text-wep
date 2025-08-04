import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import {UserNavbarComponent} from "../../../core/components/user-navbar/user-navbar.component";
import {LayoutComponent} from "../../../core/components/layout.component";
import {TranslateModule} from "@ngx-translate/core";
import {PriorityComponent} from "../../../core/components/priority.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {UserImageComponent} from "../../../core/components/user-image.component";
import {ArabicDatePipe} from "../../../core/pipes/arabic-date.pipe";
import {TimeLeftComponent} from "../../../core/components/time-left.component";
import {MatMenuModule} from "@angular/material/menu";
import {TaskStatusComponent} from "../../../core/components/task-status.component";
import {NotFoundComponent} from "../../../core/components/not-found.component";
import {LoadingComponent} from "../../../core/components/loading.component";
import {NgxPaginationModule} from "ngx-pagination";
import {InfoSidebarComponent} from "../../../core/components/info-sidebar.component";


@NgModule({
  declarations: [
    ProjectsComponent
  ],
    imports: [
        CommonModule,
        ProjectsRoutingModule,
        UserNavbarComponent,
        LayoutComponent,
        TranslateModule,
        PriorityComponent,
        MatTooltipModule,
        UserImageComponent,
        ArabicDatePipe,
        TimeLeftComponent,
        MatMenuModule,
        TaskStatusComponent,
        NotFoundComponent,
        LoadingComponent,
        NgxPaginationModule,
        InfoSidebarComponent
    ]
})
export class ProjectsModule { }
