import {Component, ElementRef, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArabicNumbersPipe} from "../../../../core/pipes/arabic-numbers.pipe";
import {LayoutWithFiltersComponent} from "../../../../core/components/layout-with-filters.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {NgxPaginationModule} from "ngx-pagination";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {TranslateModule} from "@ngx-translate/core";
import {TeamTimesheetService} from "../../../../core/services/team-timesheet.service";
import {UserImageComponent} from "../../../../core/components/user-image.component";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {Router} from "@angular/router";
import {TimesheetService} from "../../../../core/services/timesheet.service";
import * as XLSX from "xlsx";

let dir = document.dir;
let local;
if (dir === 'rtl') {
  local = 'ar-EG'
} else {
  local = 'en-GB';
}
@Component({
  selector: 'team-timesheet',
  standalone: true,
  imports: [CommonModule, ArabicNumbersPipe, LayoutWithFiltersComponent, LoadingComponent, NgxPaginationModule, NotFoundComponent, TranslateModule, UserImageComponent, FormsModule, MatButtonModule, MatDatepickerModule, MatFormFieldModule],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: local},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
  templateUrl: './team-timesheet.component.html',
  styleUrls: ['./team-timesheet.component.scss']
})

export class TeamTimesheetComponent implements OnInit, OnDestroy {
  service = inject(TeamTimesheetService);
  timesheetSer = inject(TimesheetService)
  router = inject(Router)
  timesheet: any = [];
  loading = false;
  meta: any;
  startDate: any;
  endDate = new Date();
  constructor(private elm: ElementRef){}
  ngOnInit() {
    this.service.loading.subscribe(res => this.loading = res);
    this.service.meta.subscribe(res => this.meta = res);
    this.service.startDate.subscribe((res) => this.startDate = res);
    this.service.endDate.subscribe((res) => this.endDate = res);
    this.service.timesheet$.subscribe((res: any) => this.timesheet = res)
  }

  dateChanged() {
    this.service.startDate.next(this.startDate);
    this.service.endDate.next(this.endDate || new Date());
    this.service.hasChanged.next(true)
  }

  getUserTimeSheet(id: any) {
    this.timesheetSer.from.next(this.startDate);
    this.timesheetSer.to.next(this.endDate);
    this.router.navigate(['/hr/team-timesheet/'+ id])
  }

  trackBy(index: any, item: any) {
    return item.id;
  }

  ngOnDestroy() {
    this.service.loading.next(true)
  }

  protected readonly Math = Math;

  exportToExcel() {
    /* pass here the table id */
    let element = this.elm.nativeElement.querySelector('#team-timesheet');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'team-timesheet.xlsx');
  }
}
