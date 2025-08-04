import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../../../core/components/layout.component';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigurationService } from '../../../../core/services/configuration.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { LeavesListComponent } from './leaves-list/leaves-list.component';
import { HolidaysListComponent } from './holidays-list/holidays-list.component';
import { JobTitlesComponent } from './job-titles/job-titles.component';
import { BanksComponent } from './banks/banks.component';
import { PenaltyTypesComponent } from './penalty-types/penalty-types.component';
import { WorkTypesComponent } from './work-types/work-types.component';
import { ExperienceComponent } from './experience-levels/experience-levels.component';
import { FileTypesTypesComponent } from './file-types/file-types.component';
import { RewardsTypesComponent } from './rewards-types/rewards-types.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { DepartmentListComponent } from "./departments-list/departments-list.component";
import { PlacesListComponent } from "./places-list/places-list.component";
import { LevelsListComponent } from "./levels-list/levels-list.component";
import { KpisComponent } from "../employee/kpis/kpis.component";
import { PayrollCycleComponent } from './payroll-cycle/payroll-cycle.component';
import { AttendanceLeaveComponent } from './attendance-leave/attendance-leave.component';
import { TasksConfigComponent } from './tasks-config/tasks-config.component';
@Component({
  selector: 'space-configuration',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    TranslateModule,
    MatTabsModule,
    LeavesListComponent,
    HolidaysListComponent,
    JobTitlesComponent,
    BanksComponent,
    PenaltyTypesComponent,
    WorkTypesComponent,
    ExperienceComponent,
    FileTypesTypesComponent,
    RewardsTypesComponent,
    ShiftsComponent,
    DepartmentListComponent,
    PlacesListComponent,
    LevelsListComponent,
    KpisComponent,
    PayrollCycleComponent,
    AttendanceLeaveComponent,
    TasksConfigComponent
],
  templateUrl: './space-configuration.component.html',
  styleUrls: ['./space-configuration.component.scss'],
})
export class SpaceConfigurationComponent {
  service = inject(ConfigurationService);
  dialog = inject(MatDialog);
  activeTab = 0;

  onTabChange(event: any) {
    this.activeTab = event.index;
  }
}
