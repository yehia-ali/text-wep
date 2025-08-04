import {Component, ElementRef, inject, OnDestroy, OnInit} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {LayoutComponent} from "../../../../core/components/layout.component";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {TimesheetService} from "../../../../core/services/timesheet.service";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {Subscription} from "rxjs";
import {ArabicNumbersPipe} from "../../../../core/pipes/arabic-numbers.pipe";
import {ArabicTimePipe} from "../../../../core/pipes/arabic-time.pipe";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {NgxPaginationModule} from "ngx-pagination";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {MagicScrollDirective} from "../../../../core/directives/magic-scroll.directive";
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {PageInfoService} from "../../../../core/services/page-info.service";
import * as XLSX from "xlsx";
let dir = document.dir;
let local;
if (dir === 'rtl') {
  local = 'ar-EG'
} else {
  local = 'en-GB';
}


@Component({
  selector: 'timesheet-list',
  standalone: true,
  imports: [CommonModule, LayoutComponent, MatButtonModule, MatDatepickerModule, MatFormFieldModule, ReactiveFormsModule, TranslateModule, FormsModule, ArabicNumbersPipe, ArabicTimePipe, LoadingComponent, NgxPaginationModule, NotFoundComponent, MagicScrollDirective, ArabicDatePipe , RouterModule] ,
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: local},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
  templateUrl: './timesheet-list.component.html',
  styleUrls: ['./timesheet-list.component.scss']
})
export class TimesheetListComponent implements OnInit, OnDestroy {
  service = inject(TimesheetService);
  route = inject(ActivatedRoute);
  pageInfoSer = inject(PageInfoService);
  currentDate = new Date();
  startDate: any = this.datePipe.transform(this.currentDate, 'yyyy-MM-01');
  endDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
  source$: Subscription;
  timesheet: any = [];
  loading = false;
  meta: any;

  currentUser = localStorage.getItem('id')

  constructor(private datePipe:DatePipe , private elm: ElementRef) {

  }

  ngOnInit() {
    console.log(this.startDate);
    console.log(this.endDate);
    this.dateChanged()
    this.pageInfoSer.pageInfoEnum.next('Timesheet');
    const id = this.route.snapshot.paramMap.get('id');
    this.service.userId.next(id || localStorage.getItem('id'))
    this.service.meta.subscribe(res => this.meta = res);
    this.service.loading.subscribe(res => this.loading = res);
    this.source$ = this.service.timesheet$.subscribe((res: any) => {
      let timesheet = res;
      timesheet.dataList?.forEach((data: any) => {
        data.expanded = false;
      });
      this.timesheet = timesheet;
    });
  }

  dateChanged() {
    this.service.from.next(this.datePipe.transform(this.startDate, 'yyyy-MM-dd'));
    this.service.to.next(this.datePipe.transform(this.endDate, 'yyyy-MM-dd'));
    this.service.hasChanged.next(true)
  }

  trackBy(index: any, item: any) {
    return item.id;
  }

  ngOnDestroy() {
    this.source$.unsubscribe();
    this.service.loading.next(true)
    this.pageInfoSer.pageInfoEnum.next('');
  }

  protected readonly Math = Math;

  exportToExcel() {
      /* pass here the table id */
      let element = this.elm.nativeElement.querySelector('#timesheet-list');
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      let filename = this.service.userId.value != this.currentUser ? (this.timesheet.userName + '-timesheet.xlsx') : ('my-timesheet-list.xlsx');
      XLSX.writeFile(wb, filename);
    }
}
