import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {DashboardCardComponent} from "./components/dashboard-card/dashboard-card.component";
import {DashboardChartComponent} from "./components/dashboard-chart/dashboard-chart.component";
import {MagicScrollDirective} from "../../../core/directives/magic-scroll.directive";
import {LayoutComponent} from "../../../core/components/layout.component";
import {AttendanceCardComponent} from "../../../core/components/attendance-card/attendance-card.component";
import {DoughnutChartModule} from "../../../core/components/doughnut-chart/doughnut-chart.module";
import {LayoutModule} from "@angular/cdk/layout";
import {StatisticsCardModule} from "../../../core/components/statistics-card/statistics-card.module";
import {WorkingHoursModule} from "../../../core/components/working-hours/working-hours.module";
import {ArabicNumbersPipe} from "../../../core/pipes/arabic-numbers.pipe";
import {UserNavbarComponent} from "../../../core/components/user-navbar/user-navbar.component";
import {MeetingCardComponent} from "../../../core/components/meeting-card/meeting-card.component";
import { UserWithImageComponent } from "../../../core/components/user-with-image/user-with-image.component";
import { ArabicTimePipe } from "../../../core/pipes/arabic-time.pipe";
import { DashboardAttendanceCardComponent } from "./components/dashboard-attendance-card/dashboard-attendance-card.component";
import { ArabicDatePipe } from "../../../core/pipes/arabic-date.pipe";


@NgModule({
    declarations: [
        DashboardComponent,
        DashboardCardComponent,
        DashboardChartComponent,
    ],
    imports: [
    CommonModule,
    DashboardRoutingModule,
    LayoutModule,
    MatFormFieldModule,
    MatDatepickerModule,
    TranslateModule,
    FormsModule,
    MatButtonModule,
    DoughnutChartModule,
    MagicScrollDirective,
    LayoutComponent,
    AttendanceCardComponent,
    DoughnutChartModule,
    StatisticsCardModule,
    WorkingHoursModule,
    ArabicNumbersPipe,
    UserNavbarComponent,
    MeetingCardComponent,
    UserWithImageComponent,
    ArabicTimePipe,
    DashboardAttendanceCardComponent,
    ArabicDatePipe
]
})
export class DashboardModule { }
