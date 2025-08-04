import {Component, ElementRef, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {RateComponent} from "../../../../core/components/rate.component";
import {ArabicNumbersPipe} from "../../../../core/pipes/arabic-numbers.pipe";
import {DefineDaysPipe} from "../../../../core/pipes/define-days.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {UserImageComponent} from "../../../../core/components/user-image.component";
import {LayoutWithFiltersComponent} from "../../../../core/components/layout-with-filters.component";
import {SearchComponent} from "../../../../core/filters/search.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {MatButtonModule} from "@angular/material/button";
import {BehaviorSubject} from "rxjs";
import {TeamReport} from "../../../../core/interfaces/team-report";
import { TeamReportService } from 'src/app/core/services/team-report.service';
import * as XLSX from "xlsx";
import {FormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {SortingComponent} from "../../../../core/filters/sorting.component";
import {MonthFilterComponent} from "../../../../core/filters/month-filter.component";
import {InputLabelComponent} from "../../../../core/inputs/input-label.component";

@Component({
  selector: 'team-report',
  standalone: true,
  imports: [CommonModule, NotFoundComponent, LoadingComponent, RateComponent, ArabicNumbersPipe, DefineDaysPipe, TranslateModule, UserImageComponent, LayoutWithFiltersComponent, SearchComponent, NgSelectModule, MatButtonModule, FormsModule, NgxPaginationModule, SortingComponent, MonthFilterComponent, InputLabelComponent],
  templateUrl: './team-report.component.html',
  styleUrls: ['./team-report.component.scss']
})
export class TeamReportComponent implements OnInit {
  reports: TeamReport[] = []
  meta: any
  loading = false;
  language = localStorage.getItem('language') || 'en';
  timeOut!: any;
  averageRate = null
  performanceRate = null;
  oldValue: TeamReport[] = [];
  list = [
    {name: this.arabicNumber.transform(1), value: 1},
    {name: this.arabicNumber.transform(2), value: 2},
    {name: this.arabicNumber.transform(3), value: 3},
    {name: this.arabicNumber.transform(4), value: 4},
    {name: this.arabicNumber.transform(5), value: 5},
  ]

  constructor(public service: TeamReportService, private elm: ElementRef, private arabicNumber: ArabicNumbersPipe) {
  }

  ngOnInit(): void {
    this.service.meta.subscribe(res => this.meta = res);
    this.service.loading.subscribe(res => this.loading = res);
    this.service.teamReport.subscribe(res => {
      this.reports = res;
      this.oldValue = res;
    })
    if (this.reports.length == 0) {
      this.service.search.next('');
    }
  }

  getReport() {
    this.service.getTeamReport().subscribe()
  }

  sort(type: string, ascending: boolean, extra = '') {
    if (!extra) {
      if (ascending) {
        this.reports = this.reports.sort((a: any, b: any) => (a[type] > b[type]) ? -1 : 1)
      } else {
        this.reports = this.reports.sort((a: any, b: any) => (a[type] < b[type]) ? -1 : 1)
      }
    } else {
      if (ascending) {
        this.reports = this.reports.sort((a: any, b: any) => (a[type][extra] > b[type][extra]) ? -1 : 1)
      } else {
        this.reports = this.reports.sort((a: any, b: any) => (a[type][extra] < b[type][extra]) ? -1 : 1)
      }
    }
  }

  clientsideFilter(type: any, value: number[]) {
    this.reports = this.oldValue;
    this.reports = this.reports.filter((report: any) => value.map(res => report[type] == res).filter(Boolean)[0]);
    if (value.length == 0) this.reports = this.oldValue;
  }

  filter(value?: any, key?: BehaviorSubject<any>, name?: string) {
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => {
      this.service.currentPage.next(1);
      key?.next(value);
      this.averageRate = null;
      this.getReport()
    }, 500);
  }

  search(value: any, key: any) {
    key?.next(value);
  }

  exportToExcel() {
    /* pass here the table id */
    let element = this.elm.nativeElement.querySelector('#team-report');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'team-report.xlsx');
  }

  limitChange(e: any) {
    this.service.currentPage.next(1);
    this.service.limit.next(e);
    this.averageRate = null
    this.getReport();
  }

  changePage($event: any) {
    this.service.currentPage.next($event);
    this.averageRate = null
    this.getReport();
  }

  trackBy(index: any, item: any) {
    return item.id;
  }

}
