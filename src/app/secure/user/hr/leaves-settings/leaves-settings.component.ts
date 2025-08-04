import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from "../../../../core/components/layout.component";
import {TranslateModule} from "@ngx-translate/core";
import {ConfigurationService} from "../../../../core/services/configuration.service";
import {MatDialog} from "@angular/material/dialog";
import {AddLeaveFormComponent} from "../../../../core/components/add-leave-form/add-leave-form.component";
import {AssignLeaveFormComponent} from "../../../../core/components/assign-leave-form/assign-leave-form.component";
import {AddHolidayFormComponent} from "../../../../core/components/add-holiday-form/add-holiday-form.component";
import {RouterLink} from "@angular/router";
import {MatTabsModule} from "@angular/material/tabs";
import {LeavesListComponent} from "./leaves-list/leaves-list.component";
import {HolidaysListComponent} from "./holidays-list/holidays-list.component";

@Component({
  selector: 'leaves-settings',
  standalone: true,
  imports: [CommonModule, LayoutComponent, TranslateModule, RouterLink, MatTabsModule, LeavesListComponent, HolidaysListComponent],
  templateUrl: './leaves-settings.component.html',
  styleUrls: ['./leaves-settings.component.scss']
})
export class LeavesSettingsComponent {
  service = inject(ConfigurationService);
  dialog = inject(MatDialog);

  addLeave() {
    let dialogRef = this.dialog.open(AddLeaveFormComponent, {
      panelClass: 'large-dialog'
    });
  }

  assignLeave() {
    let dialogRef = this.dialog.open(AssignLeaveFormComponent, {
      panelClass: 'medium-dialog'
    });
  }

  addHoliday() {
    let dialogRef = this.dialog.open(AddHolidayFormComponent, {
      panelClass: 'large-dialog'
    });
  }
}
