import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BidiModule } from '@angular/cdk/bidi';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectUserComponent } from '../select-user.component';
import { UserImageComponent } from '../user-image.component';
import { TeamPayslipService } from '../../services/team-payslip.service';
import { MatButtonModule } from '@angular/material/button';
import { SubmitButtonComponent } from '../submit-button.component';
import { AlertService } from '../../services/alert.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatNativeDateModule,
} from '@angular/material/core';
import { ArabicNumbersPipe } from '../../pipes/arabic-numbers.pipe';
import { HttpParams } from '@angular/common/http';
import { ArabicDatePipe } from '../../pipes/arabic-date.pipe';
import { AllUserInfoDialogComponent } from '../all-user-info-dialog/all-user-info-dialog.component';
import { HrEmployeesService } from '../../services/hr-employees.service';
import { UserService } from '../../services/user.service';
import { MonthFilterComponent } from '../../filters/month-filter.component';


let dir = document.dir;
let local;
if (dir === 'rtl') {
  local = 'ar-EG';
} else {
  local = 'en-GB';
}

@Component({
  selector: 'create-payslip',
  standalone: true,
  imports: [
    CommonModule,
    BidiModule,
    MatDialogModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    SelectUserComponent,
    UserImageComponent,
    MatButtonModule,
    SubmitButtonComponent,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ArabicNumbersPipe,
    ArabicDatePipe,
    MonthFilterComponent
  ],
  templateUrl: './create-payslip.component.html',
  styleUrls: ['./create-payslip.component.scss'],
})
export class CreatePayslipComponent implements OnInit {
  users: any[] = [];
  service = inject(TeamPayslipService);
  dialog = inject(MatDialog);
  alert = inject(AlertService);
  selectedUser: any;
  details: any;
  loading = false;
  allowance = 0;
  deduction = 0;
  stopTimeout: any;
  now: any = new Date();
  month: any = new Date().getMonth() + 1; // Initialize with current month
  startDate: any | Date = this.datePipe.transform(new Date(), 'yyyy-MM-01');
  endDate: any | Date = this.datePipe.transform(new Date(), 'yyyy-MM-30');
  crossMonth = 0;
  fromDay: number = 1;
  toDay: number = 30;
  joinDate: any;
  monthlyWorkingHours:number;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<CreatePayslipComponent>,
    private hrService: HrEmployeesService,
    private userService: UserService
  ) {}

  ngOnInit() {
    if (this.data.user) {
      this.selectedUser = {
        imageUrl: this.data.user.employeePic,
        name: this.data.user.employeeName,
        jobTitle: this.data.user.employeeNJobTitle,
        id: this.data.user.employeeId,
      };
      this.allowance = this.data.user.extraAllowance;
      this.deduction = this.data.user.extraDeductions;
      this.details = this.data.user;
      this.endDate = this.data.user.date;
      this.getUserProfile(this.data.user.employeeId);
    }
    this.getPayrollCycle();
  }
  getUserProfile(id: any) {
    this.userService.getUserProfile(id).subscribe((res: any) => {
      this.joinDate = res.creationDate;
      this.selectedUser.isActivated = res.isActivated;
    });
  }


  submit() {
    this.loading = true;
    this.service.submitPayslip(this.details).subscribe(
      (res: any) => {
        if (res.success) {
          this.dialogRef.close(true)
          this.alert.showAlert('payslip_generated');
          this.service.hasChanged.next(true);
        } else {
          this.loading = false;
        }
      },
      () => (this.loading = false)
    );
  }

  getUser(user: any) {
    this.users = user;
    if (this.data.multi) {
      this.selectedUser = user.map((u: any) => u.id);
    } else {
      this.selectedUser = user[0];
      this.joinDate = user[0].creationDate;
      this.selectedUser.isActivated = user[0].isActivated;
    }
    // Only call calcDetails if we have both user and month
    if (this.selectedUser && this.month) {
      this.calcDetails();
    }
  }

  allowanceChange() {
    clearTimeout(this.stopTimeout);
    this.stopTimeout = setTimeout(() => {
      this.calcDetails();
    }, 400);
  }
  monthlyWorkingHoursChange() {
    clearTimeout(this.stopTimeout);
    this.stopTimeout = setTimeout(() => {
      this.calcDetails();
    }, 400);
  }

  deductionChange() {
    clearTimeout(this.stopTimeout);
    this.stopTimeout = setTimeout(() => {
      this.calcDetails();
    }, 400);
  }


  calcDetails() {

    let params = new HttpParams()
      .set('Month', this.month)
      .set('ExtraAllowance', this.allowance || 0)
      .set('ExtraDeductions', this.deduction || 0)
      .set('UserId', this.selectedUser.id)
      
    if(this.monthlyWorkingHours){
      params = params.set('WorkedHours', this.monthlyWorkingHours);
    }
    
    this.service.generatePayslip(params).subscribe((res: any) => {
      if (res.success) {
        this.details = res.data;
        this.details.date = this.endDate;
      } else {
        this.details = null;
        this.openAllInfoDialog(this.selectedUser);
      }
    });
  }
  openAllInfoDialog(users: any) {
    if (!Array.isArray(users)) {
      users = [users];
    }
    let ref = this.dialog.open(AllUserInfoDialogComponent, {
      width: '800px',
      data: {
        users: users,
      },
    });
    ref.afterClosed().subscribe((res: any) => {
      if (res && !this.data.multi) {
        this.calcDetails();
      }
    });
  }
  createMulti() {
    this.loading = true;
    let params = new HttpParams()
    .set('Month', this.month)
    this.selectedUser.forEach((userId: number) => {
      params = params.append('UsersIds', userId.toString());
    });
    this.service.createMltiPayslips(params).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.success) {
          this.alert.showAlert('success');
          this.service.hasChanged.next(true);
          this.dialogRef.close(true)
        }
        if (res.data.length === 0) {
          this.dialogRef.close(true);
        }
      },
      () => {
        this.loading = false;
        this.openAllInfoDialog(this.users);
      }
    );
  }
  getPayrollCycle() {
    this.hrService.getPayrollCycle().subscribe({
      next: (res: any) => {
        if (!res?.data) {
          this.alert.showAlert('error', 'invalid_payroll_data');
          return;
        }

        const currentDate = new Date();
        this.crossMonth = res.data.crossMonth;
        const checkCrossMonth = this.crossMonth ? 1 : 0;
        if (res.data.fromDay && res.data.toDay) {
          this.fromDay = res.data.fromDay;
          this.toDay = res.data.toDay;
          const month = (this.fromDay <= 15 && this.crossMonth) ? currentDate.getMonth()+1 : currentDate.getMonth();
          this.updateStartEndDates(currentDate, month, checkCrossMonth);
          if(this.crossMonth){
            if(new Date(this.endDate) > currentDate){
              this.now = new Date();
              this.month = currentDate.getMonth()+1;
            } else{
              this.now = new Date(currentDate.getFullYear(), currentDate.getMonth()+1 , 1);
              this.month = currentDate.getMonth()+2;
            }
          } else {
            // Ensure month is set for non-cross month scenarios
            this.month = currentDate.getMonth() + 1;
          }
  
        } else {
          this.alert.showAlert('error', 'missing_payroll_days');
        }

      },
      error: (error) => {
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

  removeUser(user: any) {
    this.users = this.users.filter((u: any) => u.id !== user.id);
    if(this.users.length === 0){
      this.selectedUser = null;
    }
  }

  setMonthAndYear(selectedDate: Date) {
    this.month = selectedDate.getMonth() + 1;
    const month = (this.fromDay <= 15 && this.crossMonth) ? selectedDate.getMonth()+1 : selectedDate.getMonth();
    this.updateStartEndDates(selectedDate, month, this.crossMonth);
  }

}
