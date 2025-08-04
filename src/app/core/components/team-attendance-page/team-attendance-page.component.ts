import {Component, ElementRef, inject} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {ArabicNumbersPipe} from "../../pipes/arabic-numbers.pipe";
import {ArabicTimePipe} from "../../pipes/arabic-time.pipe";
import {DateFilterComponent} from "../../filters/date-filter.component";
import {FormsModule} from "@angular/forms";
import {LoadingComponent} from "../loading.component";
import {NgxPaginationModule} from "ngx-pagination";
import {NotFoundComponent} from "../not-found.component";
import {SearchComponent} from "../../filters/search.component";
import {TeamDashboardComponent} from "../../../secure/user/hr/team-attendance/team-dashboard/team-dashboard.component";
import {TranslateModule} from "@ngx-translate/core";
import {UserImageComponent} from "../user-image.component";
import {TeamAttendanceService} from "../../services/team-attendance.service";
import {map, Observable, switchMap, shareReplay} from "rxjs";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from "@angular/material-moment-adapter";
import * as XLSX from "xlsx";
import { MatButtonModule } from '@angular/material/button';
import { UserWithImageComponent } from "../user-with-image/user-with-image.component";
import { ArabicDatePipe } from '../../pipes/arabic-date.pipe';

let dir = document.dir;
let local;
if (dir === 'rtl') {
  local = 'ar-EG'
} else {
  local = 'en-GB';
}

@Component({
  selector: 'team-attendance-page',
  standalone: true,
  imports: [MatButtonModule, CommonModule, ArabicNumbersPipe, ArabicTimePipe, DateFilterComponent, FormsModule, LoadingComponent, NgxPaginationModule, NotFoundComponent, SearchComponent, TeamDashboardComponent, TranslateModule, UserImageComponent, UserWithImageComponent, ArabicDatePipe, DatePipe],
  templateUrl: './team-attendance-page.component.html',
  styleUrls: ['./team-attendance-page.component.scss'],
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
export class TeamAttendancePageComponent {
  service = inject(TeamAttendanceService)
  datePipe = inject(DatePipe)
  startDate: any;
  endDate = new Date();
  loading = true;
  loadingExport = false;
  cacheTime: any;
  isDataCached = true;
  attendance$: Observable<any[]> = this.service.hasChanged.pipe(
    switchMap(() => this.service.getUsersAttendanceByManagerCache().pipe(
      map((res: any) => {
        this.loading = false;
        this.totalItems = res.cachedData.totalItems;
        this.cacheTime = this.datePipe.transform(res.cacheTime , 'yyyy-MM-ddTHH:mm:ss' , 'UTC')
        this.isDataCached = !this.service.refresh;
        this.page = res.cachedData.currentPage;
        this.service.refresh = false;
        return res.cachedData.items
      }),
      shareReplay(1)
    ))
  );
  totalItems = 0;
  limit = 15;
  page = 1;
  timeout: any;

  constructor(private elm: ElementRef) {
  }

  changeLimit() {

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (this.limit < 1) {
        this.limit = 15;
      }
      this.service.limit.next(this.limit)
      this.pageChanged(1)
    }, 500)
  }

  dateChanged(value: any) {
    this.loading = true;
    this.service.startDateFrom.next(value);
    this.service.getDashboard().subscribe()
  }


  ngOnInit() {
    this.service.startDateFrom.subscribe((res) => this.startDate = res);
    this.service.page.next(this.page);

  }

  pageChanged(page: any) {
    this.service.page.next(page);
  }

  trackBy(index: any, item: any) {
    return item.id;
  }
  refreshBtn() {
    this.loading = true;
    this.service.forceRefresh();
  }
  exportToExcel() {
    this.loadingExport = true;
    this.service.getUsersAttendanceByManagerExcel().subscribe({
      next: (result) => {
        this.loadingExport = false;
        const url = window.URL.createObjectURL(result.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.filename;
        link.click();
                window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading Excel file:', error);
      }
    });
  }

}
