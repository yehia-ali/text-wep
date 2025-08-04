import {Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutWithFiltersComponent} from "../../../../core/components/layout-with-filters.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {NgxPaginationModule} from "ngx-pagination";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {RouterLink} from "@angular/router";
import {SearchComponent} from "../../../../core/filters/search.component";
import {TranslateModule} from "@ngx-translate/core";
import {UserImageComponent} from "../../../../core/components/user-image.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {AlertService} from "../../../../core/services/alert.service";
import {BehaviorSubject, debounceTime, map, switchMap} from "rxjs";
import {LeavesDashboardService} from 'src/app/core/services/leaves-dashboard.service';
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import { YearFilterComponent } from 'src/app/core/filters/year-filter.component';
import * as moment from 'moment';
import { LeaveFormComponent } from '../leave-form/leave-form.component';

@Component({
  selector: 'leave-dashboard',
  standalone: true,
  imports: [CommonModule, LayoutWithFiltersComponent, LoadingComponent, NgxPaginationModule, NotFoundComponent, RouterLink, TranslateModule, ArabicDatePipe , MatDialogModule, YearFilterComponent],
  templateUrl: './leave-dashboard.component.html',
  styleUrls: ['./leave-dashboard.component.scss']
})
export class LeaveDashboardComponent implements OnInit, OnDestroy {

@ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
constructor( public dialog : MatDialog){}
  service = inject(LeavesDashboardService);
  alert = inject(AlertService);
  requests: any = [];
  balances: any;
  userBalances: any[] = [];
  statistics: any = []
  meta: any;
  loading = true;
  selectedYearSubject = new BehaviorSubject<string>(moment().format('YYYY'));

  ngOnInit() {
    this.service.loading.subscribe(res => this.loading = res);
    this.service.meta.subscribe(res => this.meta = res);
    this.service.year.next(this.selectedYearSubject.value)
    this.service.hasChanged.pipe(debounceTime(400), switchMap(() => {
      this.service.loading.next(true)
      return this.service.getUserBalances().pipe(map((res: any) => {
        this.userBalances = res.data
      }))
    })).subscribe();

    this.service.hasChanged.pipe(debounceTime(400), switchMap(() => {
      this.service.loading.next(true)
      return this.service.getUserRequests().pipe(map((res: any) => {
        this.requests = res;
        this.service.loading.next(false)
      }))
    })).subscribe();
    
    // Subscribe to year changes for balances
    this.service.hasChanged.pipe(
      switchMap(() => {
        this.service.loading.next(true)
        return this.service.getBalancesByYear().pipe(map((res: any) => {
          this.balances = res.data
          this.statistics = [
            {"title": "paid_leaves", "value": res.data.paidBalance, "icon": "paid-leave-primary.svg", "background": "rgba(123, 85, 211, 0.08)"},
            {"title": "used_leaves-balance", "value": res.data.usedPaid, "icon": "paid-leave-red.svg", "background": "rgba(211, 47, 47, 0.15)"},
            {"title": "leaves_balance-balance_desc", "value": res.data.unPaidBalance, "icon": "unpaid-leave-primary.svg", "background": "rgba(123, 85, 211, 0.08)"},
            {"title": "leaves_balance-balance", "value": res.data.usedUnPaid, "icon": "unpaid-leave-red.svg", "background": "rgba(211, 47, 47, 0.15)"},
          ]
          this.service.loading.next(false)
        }))
      })
    ).subscribe();
  }


  trackBy(index: any, item: any) {
    return item.id;
  }

  ngOnDestroy() {
    this.service.loading.next(true)
  }

  openDialog() {
    this.dialog.open(this.dialogTemplate,{
      width:'450px',
    });
  }
  leaveRequest() {
    this.dialog.open(LeaveFormComponent,{
      width:'550px',
    }).afterClosed().subscribe(() => {
      this.service.year.next(this.selectedYearSubject.value)
        this.service.hasChanged.next(true)
    });
  }
}
