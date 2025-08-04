import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import * as moment from 'moment';
import { NgxPaginationModule } from 'ngx-pagination';
import { BehaviorSubject, debounceTime, switchMap, map } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { LeavesDashboardService } from 'src/app/core/services/leaves-dashboard.service';
import { LoadingComponent } from 'src/app/core/components/loading.component';
import { NotFoundComponent } from 'src/app/core/components/not-found.component';
import { ArabicDatePipe } from 'src/app/core/pipes/arabic-date.pipe';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UserWithImageComponent } from 'src/app/core/components/user-with-image/user-with-image.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CustomYearPickerComponent } from 'src/app/core/filters/custom-year-picker.component';

@Component({
  selector: 'virew-details-balance',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, TranslateModule , MatButtonModule, CustomYearPickerComponent, LoadingComponent, NotFoundComponent, ArabicDatePipe , UserWithImageComponent, MatInputModule, ReactiveFormsModule],
  templateUrl: './virew-details-balance.component.html',
  styleUrls: ['./virew-details-balance.component.scss']
})
export class VirewDetailsBalanceComponent {
  service = inject(LeavesDashboardService);
  dialog = inject(MatDialog);
  alert = inject(AlertService);
  route = inject(ActivatedRoute);
  data = inject(MAT_DIALOG_DATA);
  requests: any = [];
  balances: any;
  userBalances: any[] = [];
  statistics: any = []
  loading = true;
  currentLang = localStorage.getItem('language') || 'en';
  selectedYearSubject = new BehaviorSubject<string>(moment().format('YYYY'));
  constructor( ) {
    console.log(this.data);
  }
  ngOnInit() {
    this.service.loading.subscribe(res => this.loading = res);
    this.service.year.next(this.selectedYearSubject.value)
    this.service.userId.next(this.data.data.userId)

    this.service.hasChanged.pipe(debounceTime(400), switchMap(() => {
      this.service.loading.next(true)
      return this.service.getUserRequests().pipe(map((res: any) => {
        this.requests = res;
        this.service.loading.next(false)
      }))
    })).subscribe();

    this.service.hasChanged.pipe(debounceTime(400), switchMap(() => {
      this.service.loading.next(true)
      return this.service.getBalancesByYear().pipe(map((res: any) => {
        this.balances = res.data;
        this.statistics = [
          {"title": "paid_leaves", "value": res.data.paidBalance, "icon": "paid-leave-primary.svg", "background": "rgba(123, 85, 211, 0.08)"},
          {"title": "used_leaves-balance", "value": res.data.usedPaid, "icon": "paid-leave-red.svg", "background": "rgba(211, 47, 47, 0.15)"},
          {"title": "leaves_balance-balance_desc", "value": res.data.unPaidBalance, "icon": "unpaid-leave-primary.svg", "background": "rgba(123, 85, 211, 0.08)"},
          {"title": "leaves_balance-balance", "value": res.data.usedUnPaid, "icon": "unpaid-leave-red.svg", "background": "rgba(211, 47, 47, 0.15)"},
        ];
        this.service.loading.next(false)
      }))
    })).subscribe();
  }


  trackBy(index: any, item: any) {
    return item.id;
  }

  ngOnDestroy() {
    this.service.loading.next(true)
  }
  onYearChange(year: any) {
    this.service.year.next(year);
    this.service.userId.next(this.data.data.userId);
    this.service.hasChanged.next(true);
  }
  closeDialog() {
    this.dialog.closeAll();
  }
}
