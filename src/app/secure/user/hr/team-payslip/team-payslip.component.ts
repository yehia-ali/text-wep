import {Component, inject, OnDestroy} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {LayoutWithFiltersComponent} from "../../../../core/components/layout-with-filters.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {NgxPaginationModule} from "ngx-pagination";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {SearchComponent} from "../../../../core/filters/search.component";
import {TranslateModule} from "@ngx-translate/core";
import {UserImageComponent} from "../../../../core/components/user-image.component";
import {MatDialog} from "@angular/material/dialog";
import {enumToArray} from "../../../../core/functions/enum-to-array";
import {EmploymentStatus} from "../../../../core/enums/employment-status";
import {EmploymentType} from "../../../../core/enums/employment-type";
import {TeamPayslipService} from "../../../../core/services/team-payslip.service";
import {CreatePayslipComponent} from "../../../../core/components/create-payslip/create-payslip.component";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";
import {ConfirmationMessageComponent} from "../../../../core/dialogs/confirmation-message.component";
import {AlertService} from "../../../../core/services/alert.service";
import {Subscription} from "rxjs";
import { DateRangeComponent } from '../../../../core/components/date-range/date-range.component';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';

@Component({
  selector: 'team-payslip',
  standalone: true,
  imports: [CommonModule, LayoutWithFiltersComponent, LoadingComponent, NgxPaginationModule, NotFoundComponent, SearchComponent, TranslateModule, UserImageComponent, MatCheckboxModule, MatButtonModule, DateRangeComponent, DatePipe],
  templateUrl: './team-payslip.component.html',
  styleUrls: ['./team-payslip.component.scss']
})
export class TeamPayslipComponent implements OnDestroy {
  hrService = inject(HrEmployeesService);
  service = inject(TeamPayslipService)
  dialog = inject(MatDialog)
  alert = inject(AlertService)
  datePipe = inject(DatePipe)
  list: any[] = [];
  meta: any;
  status = enumToArray(EmploymentStatus)
  types = enumToArray(EmploymentType)
  allChecked = false;
  selectedUsers: any = [];
  selectedUsersToTakeAction = [];
  source$: Subscription;
  maxDate:any = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
  startDate: any|Date = this.datePipe.transform(new Date() , 'yyyy-MM-01');
  endDate: any | Date = this.datePipe.transform(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0) , 'yyyy-MM-dd');
  month: number;
  crossMonth: number = 0;
  fromDay: number;
  toDay: number;


  constructor() {
    this.source$ = this.service.list$.subscribe(res => {
      this.meta = this.service.meta.value;
      this.list = res
    });
    this.getPayrollCycle();
  }
  dateChange(event:any) {
    this.service.startDate = this.datePipe.transform(new Date(event.startDate) , 'yyyy-MM-dd')
    this.service.endDate = this.datePipe.transform(new Date(event.endDate) , 'yyyy-MM-dd')
    this.service.hasChanged.next(true);
  }

  create(user?: any) {
    this.dialog.open(CreatePayslipComponent, {
      width: '850px',
      data: {
        user: user,
        multi:false
      }
    })
  }

  takeAction(type: number) {
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      data: {
        btn_name: type == 3 ? 'approve' : 'reject',
        message: type == 3 ? 'approve_payslip' : 'reject_payslip',
        classes: type == 3 ? 'bg-primary white' : 'bg-danger white'
      }
    })

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.service.updatePayslip(type).subscribe((res: any) => {
          if (res.success) {
            this.service.hasChanged.next(true);
            this.service.selectedUsersToTakeAction.next([]);
            this.alert.showAlert('payslip_updated')
          }
        })
      }
    })


  }

  selectAllUsers($event: any) {
    this.allChecked = true;
    this.list.forEach((item: any) => {
      this.selectUser($event, item)
    })
  }

  selectUser($event: any, user: any) {
    if ($event.checked) {
      user.isSelected = true;
      this.getSelectedUsers()

    } else {
      this.allChecked = false;
      this.removeSelectedUser(user);
      user.isSelected = false;
    }
    this.checkAllCheckedUsers();
  }

  getSelectedUsers() {
    this.selectedUsers = this.list.filter((user: any) => {
      return user.isSelected
    });
    let arr: any = [];
    this.selectedUsers = this.selectedUsers.filter((user: any) => {
      return !this.selectedUsersToTakeAction.find((_user: any) => user.id == _user.id);
    });
    this.service.selectedUsersToTakeAction.next(arr.concat(this.selectedUsersToTakeAction, this.selectedUsers));
  }

  removeSelectedUser(user: any) {
    let newArr = this.selectedUsersToTakeAction.filter((_user: any) => {
      return user.id != _user.id
    });
    this.service.selectedUsersToTakeAction.next(newArr);
  }

  checkAllCheckedUsers() {
    let selectedLength = 0
    this.list.forEach((user: any) => {
      if (user.isSelected) {
        selectedLength++;
      }
    });
    this.allChecked = selectedLength == this.list.length;
  }

  trackBy(index: any, item: any) {
    return item.id;
  }

  ngOnDestroy() {
    this.source$.unsubscribe();
  }
  bulkPayslips() {
    this.dialog.open(CreatePayslipComponent, {
      panelClass: 'create-task-dialog',
      data: {
        multi: true,
      }
    })
  }
  getPayrollCycle() {
    this.hrService.getPayrollCycle().subscribe({
      next: (res: any) => {
        if (!res?.data) {
          this.alert.showAlert('error', 'invalid_payroll_data');
          return;
        }

        const currentDate = new Date();
        this.month = currentDate.getMonth()+1;
        this.crossMonth = res.data.crossMonth;
        const checkCrossMonth = this.crossMonth ? 1 : 0;

        if (res.data.fromDay && res.data.toDay) {
          this.fromDay = res.data.fromDay;
          this.toDay = res.data.toDay;
          const month = (this.fromDay <= 15 && this.crossMonth) ? currentDate.getMonth()+1 : currentDate.getMonth();
          this.updateStartEndDates(currentDate, month, checkCrossMonth);
        } else {
          this.alert.showAlert('error', 'missing_payroll_days');
        }
      },
      error: (error: any) => {
        console.error('Error fetching payroll cycle:', error);
        this.alert.showAlert('error', 'fetch_payroll_failed');
      }
    });
  }

  private updateStartEndDates(baseDate: Date, month: number, checkCrossMonth: number): void {
    try {
      this.startDate = this.datePipe.transform(
        new Date(baseDate.getFullYear(), month - checkCrossMonth, this.fromDay),
        'yyyy-MM-dd'
      );
      const endDay = this.crossMonth ? this.toDay : new Date(baseDate.getFullYear(), month+1, 0).getDate() ;

      this.endDate = this.datePipe.transform(
        new Date(baseDate.getFullYear(), month , endDay),
        'yyyy-MM-dd'
      );

      if (!this.startDate || !this.endDate) {
        throw new Error('Invalid date transformation');
      }
    } catch (error) {
      console.error('Error updating dates:', error);
      this.alert.showAlert('error', 'date_update_failed');
    }
  }


  setMonthAndYear(selectedDate: Date) {
    this.month = selectedDate.getMonth() + 1;
    const month = (this.fromDay <= 15 && this.crossMonth) ? selectedDate.getMonth()+1 : selectedDate.getMonth();
    this.updateStartEndDates(selectedDate, month, this.crossMonth);
  }
}
