import {Component, ElementRef, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialog} from "@angular/material/dialog";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import * as XLSX from "xlsx";
import {BillingOrdersService} from "../../../core/services/super-admin/billing-orders.service";
import {LayoutWithFiltersComponent} from "../../../core/components/layout-with-filters.component";
import {SortingComponent} from "../../../core/filters/sorting.component";
import {NgxPaginationModule} from "ngx-pagination";
import {ArabicDatePipe} from "../../../core/pipes/arabic-date.pipe";
import {NotFoundComponent} from "../../../core/components/not-found.component";
import {LoadingComponent} from "../../../core/components/loading.component";
import {UserNavbarComponent} from "../../../core/components/user-navbar/user-navbar.component";
import {LayoutService} from "../../../core/services/layout.service";
import {SpacesComponent} from "../../../core/filters/super-admin/spaces/spaces.component";

@Component({
  selector: 'billing-orders',
  standalone: true,
  imports: [CommonModule, LayoutWithFiltersComponent, TranslateModule, SortingComponent, NgxPaginationModule, ArabicDatePipe, NotFoundComponent, LoadingComponent, UserNavbarComponent, SpacesComponent],
  templateUrl: './billing-orders.component.html',
  styleUrls: ['./billing-orders.component.scss']
})
export class BillingOrdersComponent implements OnInit {
  meta: any
  orders: any[] = [];
  loading = false;
  dir = document.dir;
  timeout: any;

  constructor(public service: BillingOrdersService, private dialog: MatDialog, private elm: ElementRef, private layoutSer: LayoutService, public translate: TranslateService) {
  }

  ngOnInit(): void {
    this.layoutSer.withSubMenu.next(false)
    this.service.orders.subscribe(res => this.orders = res);
    this.service.meta.subscribe(res => this.meta = res);
    this.service.loading.subscribe(res => this.loading = res);
    if (this.orders.length == 0) {
      this.service.search.next('');
    }
  }

  getBillingOrders(): any {
    this.loading = true;
    this.service.getBillingOrders().subscribe(() => {
      this.loading = false
    })
  }

  search($event: string) {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.service.currentPage.next(1)
      this.service.search.next($event);
      this.getBillingOrders()
    }, 500);
  }

  changePage($event: any) {
    this.service.currentPage.next($event);
    this.getBillingOrders()
  }

  sort(value: any, direction: any) {
    this.service.currentPage.next(1)
    this.service.sort.next(value)
    this.service.sortDirection.next(direction)
    this.getBillingOrders()
  }

  limitChanged(e: any) {
    this.service.currentPage.next(1);
    this.service.limit.next(e);
    this.getBillingOrders();
  }

  exportToExcel() {
    /* pass here the table id */
    let element = this.elm.nativeElement.querySelector('#orders-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'orders.xlsx');
  }

  trackBy(index: any, item: any) {
    return item.spaceId;
  }
}
