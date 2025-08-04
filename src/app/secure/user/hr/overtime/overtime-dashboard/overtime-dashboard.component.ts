import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {debounceTime, map, switchMap} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {NgxPaginationModule} from 'ngx-pagination';
import {RouterLink} from '@angular/router';
import {OvertimeDashboardService} from 'src/app/core/services/overtime-dashboard.service';
import {LoadingComponent} from 'src/app/core/components/loading.component';
import {NotFoundComponent} from 'src/app/core/components/not-found.component';
import {SearchComponent} from 'src/app/core/filters/search.component';
import {UserImageComponent} from 'src/app/core/components/user-image.component';
import {AlertService} from 'src/app/core/services/alert.service';
import {ArabicDatePipe} from 'src/app/core/pipes/arabic-date.pipe';
import {LayoutWithFiltersComponent} from 'src/app/core/components/layout-with-filters.component';
import {OvertimeFilterComponent} from '../overtime-filter/overtime-filter.component';
import {ConvertToTimePipe} from 'src/app/core/pipes/convert-to-time.pipe';
import {NgSelectModule} from '@ng-select/ng-select';
import {AttendanceService} from 'src/app/core/services/attendance.service';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {PriorityComponent} from "../../../../../core/components/priority.component";
import {PageInfoService} from "../../../../../core/services/page-info.service";


let dir = document.dir;
let local;
if (dir === 'rtl') {
  local = 'ar-EG'
} else {
  local = 'en-GB';
}


@Component({
  selector: 'overtime-dashboard',
  standalone: true,
  templateUrl: './overtime-dashboard.component.html',
  styleUrls: ['./overtime-dashboard.component.scss'],
  imports: [
    CommonModule,
    LayoutWithFiltersComponent,
    LoadingComponent,
    NgxPaginationModule,
    NotFoundComponent,
    RouterLink,
    SearchComponent,
    TranslateModule,
    UserImageComponent,
    ArabicDatePipe,
    OvertimeFilterComponent,
    ConvertToTimePipe,
    NgSelectModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    PriorityComponent
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: local},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class OvertimeDashboardComponent implements OnInit, OnDestroy {
  pageInfoSer = inject(PageInfoService);
  service = inject(OvertimeDashboardService);
  teamMember = inject(AttendanceService);
  dialog = inject(MatDialog);
  alert = inject(AlertService);
  requests: any = [];
  meta: any;
  loading = true;
  totalHours: any
  selectedUser = null;
  selectedStatus = null;
  teamMembers$ = this.teamMember.getTeamMembers();
  from = '';
  to = '';
  status = [
    {"value": 0, "name": "pending"},
    {"value": 1, "name": "approved"},
    {"value": 2, "name": "rejected"},
    {"value": 3, "name": "canceled"}
  ];

  ngOnInit() {
    this.pageInfoSer.pageInfoEnum.next('Overtime');
    this.service.from.subscribe((res) => this.from = res);
    this.service.to.subscribe((res) => this.to = res);
    this.service.loading.subscribe((res) => (this.loading = res));
    this.service.meta.subscribe((res) => (this.meta = res));
    this.getMyRequests();
  }

  dateChanged() {
    this.service.from.next(this.from);
    this.service.to.next(this.to || new Date());
    this.userChanged()
  }


  trackBy(index: any, item: any) {
    return item.id;
  }

  getMyRequests() {
    this.service.hasChanged
      .pipe(
        debounceTime(400),
        switchMap(() => {
          this.service.loading.next(true);
          return this.service.getUserOvertimeRequests().pipe(
            map((res: any) => {
              this.totalHours = res.totalApprovedHours
              this.requests = res.requests;
              this.service.loading.next(false);
            })
          );
        })
      )
      .subscribe();
  }

  gitUserRequests() {
    this.service.hasChanged.pipe(
      debounceTime(400),
      switchMap(() => {
        this.service.loading.next(true);
        return this.service.GetUserRequests().pipe(
          map((res: any) => {
            this.totalHours = res.totalApprovedHours
            this.requests = res.requests;
            this.service.loading.next(false);
          })
        );
      })
    ).subscribe();
  }

  statusChanged() {
    this.service.setStatus(this.selectedStatus)
    this.userChanged()
  }

  userChanged() {
    if (this.selectedUser) {
      this.service.userId = this.selectedUser;
      this.gitUserRequests()
    } else {
      this.getMyRequests()
    }
  }


  ngOnDestroy() {
    this.service.loading.next(true);
    this.pageInfoSer.pageInfoEnum.next('');
  }
}
