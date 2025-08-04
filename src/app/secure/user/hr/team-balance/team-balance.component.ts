import {Component, OnInit, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {TranslateModule} from "@ngx-translate/core";
import {NgxPaginationModule} from "ngx-pagination";
import {NgSelectModule} from '@ng-select/ng-select';
import * as moment from 'moment';
import {BehaviorSubject, debounceTime, switchMap, map} from 'rxjs';

import {TeamBalanceService} from "../../../../core/services/team-balance.service";
import {AttendanceService} from 'src/app/core/services/attendance.service';
import {LayoutWithFiltersComponent} from "../../../../core/components/layout-with-filters.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {SelectUserComponent} from "../../../../core/components/select-user.component";
import {UserWithImageComponent} from "../../../../core/components/user-with-image/user-with-image.component";
import {YearFilterComponent} from 'src/app/core/filters/year-filter.component';
import {LevelsFilterComponent} from 'src/app/core/components/new-filters/levels-filter/levels-filter.component';
import {InputLabelComponent} from 'src/app/core/inputs/input-label.component';
import {VirewDetailsBalanceComponent} from './virew-details-balance/virew-details-balance.component';

@Component({
  selector: 'team-balance',
  standalone: true,
  imports: [
    CommonModule, 
    LayoutWithFiltersComponent, 
    LoadingComponent, 
    NgxPaginationModule, 
    NotFoundComponent, 
    TranslateModule, 
    SelectUserComponent, 
    UserWithImageComponent, 
    MatButtonModule, 
    NgSelectModule, 
    YearFilterComponent, 
    LevelsFilterComponent, 
    InputLabelComponent
  ],
  templateUrl: './team-balance.component.html',
  styleUrls: ['./team-balance.component.scss']
})
export class TeamBalanceComponent implements OnInit {
  service = inject(TeamBalanceService);
  attendanceService = inject(AttendanceService);
  dialog = inject(MatDialog);
  balances: any = [];
  meta: any;
  loading = false;
  leaveTypes: Set<string> = new Set();
  teamMembers$ = this.attendanceService.getTeamMembers();
  selectedYearSubject = new BehaviorSubject<string>(moment().format('YYYY'));

  constructor() {
  }

  ngOnInit() {
    this.service.loading.subscribe(res => this.loading = res);
    this.service.year.next(this.selectedYearSubject.value)
    this.service.hasChanged.pipe(debounceTime(400), switchMap(() => {
      this.service.loading.next(true)
      return this.service.getBalances().pipe(map((res: any) => {
        this.balances = res.pagedModel.items;
        this.balances.forEach((balance: any) => {
          balance.balanceDetails.forEach((detail: any) => {
            this.leaveTypes.add(detail.leaveTypeName);
          });
        });
        this.service.loading.next(false)
      }))
    })).subscribe();

    this.service.balanceMeta.subscribe(res => this.meta = res);
  }

  getBalanceForLeaveType(balance: any, leaveType: string): any {
    const balanceDetail = balance.balanceDetails.find((detail: any) => detail.leaveTypeName === leaveType);
    return balanceDetail ? {total: balanceDetail.total, used: balanceDetail.total - balanceDetail.balance} : {total: 0, used: 0};
  }
  
  exportFile(){
    this.service.getBalancesFile().subscribe();
  }
  
  changePage($event: any) {
    this.service.page.next($event);
    this.service.hasChanged.next(true);
  }

  viewBalance(rowData: any) {
    this.dialog.open(VirewDetailsBalanceComponent, {
      width: '90vw',
      data: {
        data: rowData
      }
    });
  }
  
  trackBy(index: any, item: any) {
    return item.taskId;
  }   
}
