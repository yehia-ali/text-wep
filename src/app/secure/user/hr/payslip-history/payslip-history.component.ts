import {Component, inject, OnDestroy} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {LayoutWithFiltersComponent} from "../../../../core/components/layout-with-filters.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {NgxPaginationModule} from "ngx-pagination";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {SearchComponent} from "../../../../core/filters/search.component";
import {TranslateModule} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {enumToArray} from "../../../../core/functions/enum-to-array";
import {EmploymentStatus} from "../../../../core/enums/employment-status";
import {EmploymentType} from "../../../../core/enums/employment-type";
import {PayslipHistoryService} from "../../../../core/services/payslip-history.service";
import {Subscription} from "rxjs";
import { ArabicDatePipe } from "../../../../core/pipes/arabic-date.pipe";
import { DateRangeComponent } from "../../../../core/components/date-range/date-range.component";
import { HttpParams } from '@angular/common/http';
import { UserWithImageComponent } from "../../../../core/components/user-with-image/user-with-image.component";

@Component({
  selector: 'payslip-history',
  standalone: true,
  providers:[DatePipe],
    imports: [CommonModule, LayoutWithFiltersComponent, LoadingComponent, NgxPaginationModule, NotFoundComponent, SearchComponent, TranslateModule, ArabicDatePipe, DateRangeComponent, UserWithImageComponent],
  templateUrl: './payslip-history.component.html',
  styleUrls: ['./payslip-history.component.scss']
})
export class PayslipHistoryComponent{
  limit = 15;
  page = 1;
changePage(event:any) {
  this.page = event
  this.getPayslips()
}
loading: any;
  search(event:any) {
    this.searchValue = event
    this.getPayslips()
  }

  searchValue:any
  service = inject(PayslipHistoryService)
  dialog = inject(MatDialog)
  list: any[] = [];
  meta: any;
  status = enumToArray(EmploymentStatus)
  types = enumToArray(EmploymentType)
  source$: Subscription;
  startDate: any;
  endDate: any;

  constructor(private datePipe: DatePipe) {
    const currentDate = new Date();
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const lastDay = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);

    this.startDate = this.datePipe.transform(prevMonth, 'yyyy-MM-01')!;
    this.endDate = this.datePipe.transform(lastDay, 'yyyy-MM-dd')!;


  }
  ngOnInit() {
    console.log('this.startDate', this.startDate);
    console.log('this.EndDate', this.endDate);
    this.getPayslips()
  }

  getPayslips() {
    this.loading = true
    let params = new HttpParams()
      .set('from', this.startDate)
      .set('to', this.endDate)
      .set('paySlipStatus', '3')
      .set('Page', this.page)
      .set('limit', this.limit);

    if(this.searchValue){
      params = params.set('EmployeeName', this.searchValue || '')
    }
    this.service.GetAdminPaySlips(params).subscribe({
      next: (res:any) => {
        this.list = res.data.items
        this.meta = res.data
        this.loading = false
      },
      error: (error) => {
        console.error('Error retrieving payslips:', error);
      }
    });
  }


  // ngOnDestroy() {
  //   this.source$.unsubscribe();
  // }

  dateChange($event: any) {
    this.startDate = this.datePipe.transform($event.startDate, 'yyyy-MM-01');
    this.endDate =this.datePipe.transform($event.endDate , 'yyyy-MM-dd');
    this.getPayslips()
  }

}
