import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {ArabicTimePipe} from "../../../../core/pipes/arabic-time.pipe";
import {AttendanceCardComponent} from "../../../../core/components/attendance-card/attendance-card.component";
import {LayoutComponent} from "../../../../core/components/layout.component";
import {MagicScrollDirective} from "../../../../core/directives/magic-scroll.directive";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {UserDashboardComponent} from "./user-dashboard/user-dashboard.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {NgxPaginationModule} from "ngx-pagination";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {NewAttendanceService} from "../../../../core/services/new-attendance.service";
import {UserAttendance} from "../../../../core/interfaces/user-attendance";
import {map, Observable, switchMap} from "rxjs";
import {AttendanceService} from "../../../../core/services/attendance.service";
import {UserService} from "../../../../core/services/user.service";

let dir = document.dir;
let local;
if (dir === 'rtl') {
  local = 'ar-EG'
} else {
  local = 'en-GB';
}

@Component({
  selector: 'new-attendance',
  standalone: true,
  imports: [CommonModule, ArabicDatePipe, ArabicTimePipe, AttendanceCardComponent, LayoutComponent, MagicScrollDirective, MatButtonModule, MatDatepickerModule, MatFormFieldModule, NgSelectModule, ReactiveFormsModule, TranslateModule, FormsModule, UserDashboardComponent, LoadingComponent, NgxPaginationModule, NotFoundComponent],
  templateUrl: './new-attendance.component.html',
  styleUrls: ['./new-attendance.component.scss'],
  encapsulation: ViewEncapsulation.None,
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
export class NewAttendanceComponent implements OnInit {
  service = inject(NewAttendanceService)
  attendanceService = inject(AttendanceService)
  userSer = inject(UserService);
  startDate: any;
  endDate: any = new Date();
  loading = false;
  meta: any;
  attendance$!: Observable<UserAttendance[]>;
  teamMembers$ = this.attendanceService.getTeamMembers();
  selectedUser = null;

  constructor() {
    this.service.startDateFrom.subscribe((res) => this.startDate = res);
    this.service.startDateTo.subscribe((res) => this.endDate = res);
  }

  ngOnInit() {
    this.userSer.user$.subscribe((res: any) => {
      if (!!res.creationDate) {
        const creationDate = new Date(res.creationDate);
        const currentDate = new Date();

        // Check if the creation date is in the current month
        if (creationDate.getFullYear() === currentDate.getFullYear() && creationDate.getMonth() === currentDate.getMonth()) {
          this.service.startDateFrom.next(new Date(new Date(res.creationDate).getFullYear(), new Date(res.creationDate).getMonth(), new Date(res.creationDate).getDate()))
        }
        this.attendance$ = this.service.hasChanged.pipe(switchMap(() => this.service.getUserAttendance().pipe(map((res: any) => res))));
        this.service.getDashboard().subscribe();
      }
    })
  }

  userChanged() {
    this.service.selectedUser.next(this.selectedUser);
    this.service.getDashboard().subscribe()
    this.service.hasChanged.next(true)
  }

  dateChanged() {
    this.service.startDateFrom.next(this.startDate._d);
    this.service.startDateTo.next(this.endDate._d || new Date());
    this.service.hasChanged.next(true);
    this.service.getDashboard().subscribe()
  }

  trackBy(index: any, item: any) {
    return item.id;
  }
}
