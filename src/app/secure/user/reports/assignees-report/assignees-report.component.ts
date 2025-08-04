import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as XLSX from "xlsx";
import {AssigneeReport} from "../../../../core/interfaces/assignee-report";
import {AssigneeReportService} from "../../../../core/servicess/assignee-report.service";
import {LayoutWithFiltersComponent} from "../../../../core/components/layout-with-filters.component";
import {ReportsFilterComponent} from "../reports-filter/reports-filter.component";
import {TranslateModule} from "@ngx-translate/core";
import {SortingComponent} from "../../../../core/filters/sorting.component";
import {UserImageComponent} from "../../../../core/components/user-image.component";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {NgxPaginationModule} from "ngx-pagination";
import {Subscription} from "rxjs";
import { UserWithImageComponent } from "../../../../core/components/user-with-image/user-with-image.component";

@Component({
    selector: 'assignees-report',
    standalone: true,
    imports: [CommonModule, LayoutWithFiltersComponent, ReportsFilterComponent, TranslateModule, SortingComponent, NotFoundComponent, LoadingComponent, NgxPaginationModule, UserWithImageComponent],
    templateUrl: './assignees-report.component.html',
    styleUrls: ['./assignees-report.component.scss']
})
export class AssigneesReportComponent implements OnInit, OnDestroy {

    reports!: AssigneeReport[] | any;
    meta: any;
    loading = false;
    source$!: Subscription;

    constructor(public service: AssigneeReportService, private elm: ElementRef) {
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
        let element = this.elm.nativeElement.querySelector('#assignees-table');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, 'assignees.xlsx');
    }


    trackBy(index: any, item: any) {
        return item.id;
    }

    ngOnDestroy() {
        this.source$.unsubscribe();
    }

}
