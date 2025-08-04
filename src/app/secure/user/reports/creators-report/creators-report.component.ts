import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as XLSX from "xlsx";
import {CreatorReport} from "../../../../core/interfaces/creator-report";
import {CreatorReportService} from "../../../../core/servicess/creator-report.service";
import {LayoutWithFiltersComponent} from "../../../../core/components/layout-with-filters.component";
import {SortingComponent} from "../../../../core/filters/sorting.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgxPaginationModule} from "ngx-pagination";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {ReportsFilterComponent} from "../reports-filter/reports-filter.component";
import {Subscription} from "rxjs";
import { UserWithImageComponent } from "../../../../core/components/user-with-image/user-with-image.component";

@Component({
    selector: 'creators-report',
    standalone: true,
    imports: [CommonModule, LayoutWithFiltersComponent, SortingComponent, TranslateModule, NgxPaginationModule, NotFoundComponent, LoadingComponent, ReportsFilterComponent, UserWithImageComponent],
    templateUrl: './creators-report.component.html',
    styleUrls: ['./creators-report.component.scss']
})
export class CreatorsReportComponent implements OnInit, OnDestroy {
    reports!: CreatorReport[] | any;
    meta: any;
    loading = false;
    source$!: Subscription;

    constructor(public service: CreatorReportService, private elm: ElementRef) {
    }

    ngOnInit(): void {
        this.source$ = this.service.reports$.subscribe(res => this.reports = res);
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
        this.service.hasChanged.next(true);
    }

    changePage($event: any) {
        this.service.page.next($event);
        this.getReports();
    }

    limitChanged(e: any) {
        this.service.page.next(1);
        this.service.limit.next(e);
        this.getReports();
    }

    exportToExcel() {
        /* pass here the table id */
        let element = this.elm.nativeElement.querySelector('#creators');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, 'creators.xlsx');
    }


    trackBy(index: any, item: any) {
        return item.id;
    }

    ngOnDestroy() {
        this.source$.unsubscribe();
    }

}
