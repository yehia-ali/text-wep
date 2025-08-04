import {Component, ElementRef, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as XLSX from "xlsx";
import {AggregateReport} from "../../../../core/interfaces/aggregate-report";
import {AggregateReportService} from "../../../../core/services/aggregate-report.service";
import {TranslateModule} from "@ngx-translate/core";
import {SortingComponent} from "../../../../core/filters/sorting.component";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {LayoutWithFiltersComponent} from "../../../../core/components/layout-with-filters.component";
import {NgxPaginationModule} from "ngx-pagination";
import {AggregateReportFilterComponent} from "./aggregate-report-filter/aggregate-report-filter.component";

@Component({
  selector: 'aggregate-report',
  standalone: true,
  imports: [CommonModule, TranslateModule, SortingComponent, NotFoundComponent, LoadingComponent, NgxPaginationModule, LayoutWithFiltersComponent, NgxPaginationModule, AggregateReportFilterComponent],
  templateUrl: './aggregate-report.component.html',
  styleUrls: ['./aggregate-report.component.scss']
})
export class AggregateReportComponent implements OnInit {

  reports!: AggregateReport[];
  meta: any;
  loading = false;

  constructor(public service: AggregateReportService, private elm: ElementRef) {
  }

  ngOnInit(): void {
    this.service.reports$.subscribe(res => this.reports = res);
    this.service.loading.subscribe(res => this.loading = res);
    this.service.meta.subscribe(res => this.meta = res);
  }

  sort(value: any, direction: any) {
    this.service.page.next(1)
    this.service.orderKey.next(value)
    this.service.orderDirection.next(direction)
    this.getReports()
  }


  getReports() {
    this.service.hasChanged.next(true)
  }


  changePage($event: any) {
    this.service.page.next($event);
    this.getReports();
  }

  exportToExcel() {
    /* pass here the table id */
    let element = this.elm.nativeElement.querySelector('#reports-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'reports-table.xlsx');
  }


  trackBy(index: any, item: any) {
    return item.id;
  }
}
