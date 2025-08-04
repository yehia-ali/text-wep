import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from "../../../core/components/layout.component";
import {TranslateModule} from "@ngx-translate/core";
import {UserNavbarComponent} from "../../../core/components/user-navbar/user-navbar.component";
import {MagicScrollDirective} from "../../../core/directives/magic-scroll.directive";
import {TeamTimingComponent} from "./team-timing/team-timing.component";
import {ManagerDashboardService} from "../../../core/services/manager-dashboard.service";
import {LoadingComponent} from "../../../core/components/loading.component";
import {TeamTasksStatisticsComponent} from "./team-tasks-statistics/team-tasks-statistics.component";
import {SelectUserComponent} from "../../../core/components/select-user.component";
import {PriorityFilterComponent} from "../../../core/filters/priority-filter.component";
import {TaskTypeComponent} from "../../../core/filters/task-type.component";
import {ProjectsComponent} from "../../../core/filters/projects.component";
import {DepartmentsComponent} from "../../../core/filters/departments.component";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {FilterLabelComponent} from "../../../core/filters/filter-label.component";

let dir = document.dir;
let local;
if (dir === 'rtl') {
  local = 'ar-EG'
} else {
  local = 'en-GB';
}

@Component({
  selector: 'manager-dashboard',
  standalone: true,
  imports: [CommonModule, LayoutComponent, TranslateModule, UserNavbarComponent, MagicScrollDirective, TeamTimingComponent, LoadingComponent, TeamTasksStatisticsComponent, SelectUserComponent, PriorityFilterComponent, TaskTypeComponent, ProjectsComponent, DepartmentsComponent, MatButtonModule, MatDatepickerModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, FilterLabelComponent],
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: local},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class ManagerDashboardComponent implements OnInit {
  service = inject(ManagerDashboardService);
  data: any;
  startDate = new Date()
  endDate = new Date()
  assignees: any[] = [];

  filterData: any;
  priority: any;
  type: any;
  project: any;
  departments: any;


  ngOnInit() {
    this.filterData = null;
    this.service.startDateFrom.subscribe(res => {
      this.startDate = new Date(res)
    });

    this.service.startDateTo.subscribe(res => {
      this.endDate = new Date(res)
    });

    this.service.inbox$.subscribe(res => {
      this.data = res;
    });
  }

  dateChanged() {
    this.service.startDateFrom.next(this.startDate);
    this.service.startDateTo.next(this.endDate);
    this.service.hasChanged.next(true);
    this.getFilterData()
  }

  getAssinee(event: any) {
    this.service.assignee.next(event)
    this.assignees = event
    this.getFilterData()
  }

  getPriority(event: any) {
    this.service.priority.next(event)
    this.priority = event
    this.getFilterData()
  }

  getType(event: any) {
    this.service.type.next(event)
    this.type = event
    this.getFilterData()
  }

  getProject(event: any) {
    this.service.project.next(event)
    this.project = event
    this.getFilterData()
  }

  getDepartments(event: any) {
    this.service.departments.next(event)
    this.departments = event
    this.getFilterData()
  }

  getFilterData() {
    this.filterData = {};

    if (this.startDate !== undefined) {
      this.filterData.startDate = this.startDate;
    }

    if (this.endDate !== undefined) {
      this.filterData.endDate = this.endDate;
    }

    if (this.assignees !== undefined) {
      this.filterData.assignees = this.assignees;
    }

    if (this.priority !== undefined) {
      this.filterData.priority = this.priority;
    }

    if (this.type !== undefined) {
      this.filterData.type = this.type;
    }

    if (this.project !== undefined) {
      this.filterData.project = this.project;
    }

    if (this.departments !== undefined) {
      this.filterData.departments = this.departments;
    }

    // Remove keys with undefined values from filterData
    Object.keys(this.filterData).forEach(key => {
      if (this.filterData[key] === undefined) {
        delete this.filterData[key];
      }
    });
  }

}
