import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgSelectModule} from "@ng-select/ng-select";
import {MagicScrollDirective} from "../../../../core/directives/magic-scroll.directive";
import {LayoutComponent} from "../../../../core/components/layout.component";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {ArabicTimePipe} from "../../../../core/pipes/arabic-time.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {AttendanceService} from "../../../../core/services/attendance.service";
import {Attendance} from "../../../../core/interfaces/attendance";
import {MatButtonModule} from "@angular/material/button";
import {AttendanceCardComponent} from "../../../../core/components/attendance-card/attendance-card.component";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {PageInfoService} from "../../../../core/services/page-info.service";

let dir = document.dir;
let local;
if (dir === 'rtl') {
  local = 'ar-EG'
} else {
  local = 'en-GB';
}

@Component({
  selector: 'attendance',
  standalone: true,
  imports: [CommonModule, MatNativeDateModule, NgSelectModule, MagicScrollDirective, LayoutComponent, FormsModule, MatInputModule, ArabicTimePipe, TranslateModule, ArabicDatePipe, MatDatepickerModule, MatButtonModule, AttendanceCardComponent],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
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
export class AttendanceComponent implements OnInit, OnDestroy {
  pageInfoSer = inject(PageInfoService);
  startDate: any;
  endDate = new Date();
  attendanceRange!: Attendance[];

  selectedUser = null;
  teamMembers$ = this.service.getTeamMembers();

  constructor(private service: AttendanceService) {
    this.service.startDateFrom.subscribe((res) => this.startDate = res);
    this.service.startDateTo.subscribe((res) => this.endDate = res);
  }

  ngOnInit(): void {
    this.pageInfoSer.pageInfoEnum.next('Attendance');
    this.getAttendanceRange()
  }

  getAttendanceRange() {
    this.service.getAttendanceRange().subscribe(res => {
      this.attendanceRange = res;
    })
  }

  dateChanged() {
    this.service.startDateFrom.next(this.startDate);
    this.service.startDateTo.next(this.endDate || new Date());
    this.getAttendanceRange()
  }

  userChanged() {
    this.service.selectedUser.next(this.selectedUser);
    this.getAttendanceRange()
  }

  ngOnDestroy() {
    this.pageInfoSer.pageInfoEnum.next('');
  }
}
