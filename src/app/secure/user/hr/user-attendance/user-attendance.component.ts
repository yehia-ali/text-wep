import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ArabicDatePipe } from '../../../../core/pipes/arabic-date.pipe';
import { ArabicTimePipe } from '../../../../core/pipes/arabic-time.pipe';
import { LayoutComponent } from '../../../../core/components/layout.component';
import { MagicScrollDirective } from '../../../../core/directives/magic-scroll.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  MatNativeDateModule,
} from '@angular/material/core';
import { LoadingComponent } from '../../../../core/components/loading.component';
import { NgxPaginationModule } from 'ngx-pagination';
import * as XLSX from 'xlsx';
import { UserAttendReportService } from 'src/app/core/services/user-attend-report.service';
import { ConvertMinutesPipe } from 'src/app/core/pipes/convert-minutes.pipe';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { AlertService } from 'src/app/core/services/alert.service';
import { environment } from 'src/environments/environment';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { MatInputModule } from '@angular/material/input';
import { UserService } from 'src/app/core/services/user.service';
import { MonthFilterComponent } from 'src/app/core/filters/month-filter.component';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

let dir = document.dir;
let local;
if (dir === 'rtl') {
  local = 'ar-EG';
} else {
  local = 'en-GB';
}

@Component({
  selector: 'user-attendance',
  standalone: true,
  imports: [
    CommonModule,
    ArabicDatePipe,
    ArabicTimePipe,
    ConvertMinutesPipe,
    LayoutComponent,
    MagicScrollDirective,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    NgSelectModule,
    ReactiveFormsModule,
    TranslateModule,
    FormsModule,
    LoadingComponent,
    NgxPaginationModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatDialogModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MonthFilterComponent,
    TimepickerModule
],
  templateUrl: './user-attendance.component.html',
  styleUrls: ['./user-attendance.component.scss'],

})
export class UserAttendanceComponent implements OnInit {
  now: any = new Date();
  month: any = new Date().getMonth() + 1;
  startDate: any | Date = this.datePipe.transform(new Date(), 'yyyy-MM-01');
  endDate: any | Date = this.datePipe.transform(new Date(), 'yyyy-MM-30');
  crossMonth = 0;
  fromDay: number = 1;
  toDay: number = 30;
  loading = false;
  meta: any;
  attendance: any;
  teamMembers$ = this.service.getSpaceMembers();
  selectedUser:any = Number(localStorage.getItem('id'));
  totalDetuction: number=0;
  selectedAttendance: any;
  newAttendanceDate: any;
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  attendanceDate:any;
  attendanceStatus: any;
  attendanceDateTime: any;
  title: string;
  attendanceTime: any;
  reportDate: string | null;
  exportUrl :any
  timezone = new Date().getTimezoneOffset()
  joinDate: any;    
  showClearBtn = false;
  checkInTime:any;
  checkOutTime:any;
  constructor(
    private elm: ElementRef,
    private service: UserAttendReportService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private alert: AlertService,
    private hrService: HrEmployeesService,
    private userService: UserService
  ) {

  }

  convertTimezoneOffset(offset:any) {
    // تحويل فرق التوقيت إلى ساعات
    const offsetInHours = -offset / 60;
    // التحقق من الإشارة وإرجاع النتيجة المناسبة
    if (offsetInHours > 0) {
      return `${offsetInHours}`;
    } else if (offsetInHours < 0) {
      return `${offsetInHours}`;
    } else {
      return '0'; // في حال كان التوقيت هو UTC نفسه
    }
  }

  ngOnInit() {
    this.getPayrollCycle();
    this.getUserProfile();
  }

  getAttendance() {
    this.loading = true;
    this.totalDetuction = 0;
    this.service
      .getUserAttendReport(this.month, this.selectedUser)
      .subscribe((res: any) => {
        if (res) {
          this.attendance = res;
          this.loading = false;
          this.attendance.list.forEach((element: any) => {
            this.totalDetuction += element.deduction;
          });
        }
      });
      this.exportUrl = `${environment.apiUrl}api/Attendance/export?From=${this.startDate}&To=${this.endDate}&spaceId=${localStorage.getItem('space-id')}&timeZone=${this.convertTimezoneOffset(this.timezone)}`
  }
  getUserProfile() {
    this.userService.getUserProfile(this.selectedUser).subscribe((res: any) => {
      this.joinDate = res.creationDate;
    });
  }

  userChanged() {
    if(!this.selectedUser){
      this.selectedUser = localStorage.getItem('id');
    }
    this.getUserProfile();
    this.getAttendance();
  }

  exportToExcel() {
    let element = this.elm.nativeElement.querySelector('#attendance');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(
      wb,
      this.attendance.list[0]?.userName +
        '-' +
        this.datePipe.transform(this.endDate, 'MMMM') +
        '-attendance.xlsx'
    );
  }

  openDialog(report: any , type:any , mode:any) {

    this.title = mode
    this.reportDate = this.datePipe.transform(report.date,'yyyy-MM-dd')
    this.checkInTime = report.checkIn;
    this.checkOutTime = report.checkOut;
    if(mode == 'create'){
      if(type =='checkIn') {
        this.attendanceStatus = 1
      }else{
        this.attendanceStatus = 2
      }
      this.attendanceDate = this.getDefaultTime();
    }else if(mode == 'update'){
      if(type =='checkIn') {
        this.selectedAttendance =  {
          id:report.checkInId,
          date:report.checkIn,
        }
      }else{
        this.selectedAttendance =  {
          id:report.checkOutId,
          date:report.checkOut,
        }
      }
      // Apply timezone offset when editing
      const originalDate = new Date(this.selectedAttendance.date);
      const offsetHours = -this.timezone / 60;
      originalDate.setHours(originalDate.getHours() + offsetHours);
      this.attendanceDate = originalDate;
    }


    this.dialog.open(this.dialogTemplate,{
      width:'500px',
    });
  }

  updateAttendance() {
    // Validate check-in time should be before check-out time
    if(this.attendanceStatus === 1 && this.checkOutTime && this.attendanceDateTime > this.checkOutTime){
      this.alert.showAlert('check_in_time_greater_than_check_out_time' , 'bg-danger')
      return;
    }
    // Validate check-out time should be after check-in time
    if(this.attendanceStatus === 2 && this.checkInTime && this.attendanceDateTime < this.checkInTime){
      this.alert.showAlert('check_out_time_less_than_check_in_time' , 'bg-danger')
      return;
    }
    
    let data = {
        id: this.selectedAttendance.id,
        dateTime: this.newAttendanceDate
    }
    this.service.updateAttendance(data).subscribe((res:any) => {
      if(res.success){
        this.alert.showAlert('success')
        this.getAttendance()
        this.closeDialog()
      }
    })
  }
  createAttendance(){
    // Validate check-in time should be before check-out time
    if(this.attendanceStatus === 1 && this.checkOutTime && this.attendanceDateTime > this.checkOutTime){
      this.alert.showAlert('check_in_time_greater_than_check_out_time' , 'bg-danger')
      return;
    }
    // Validate check-out time should be after check-in time
    if(this.attendanceStatus === 2 && this.checkInTime && this.attendanceDateTime < this.checkInTime){
      this.alert.showAlert('check_out_time_less_than_check_in_time' , 'bg-danger')
      return;
    }
    if(this.attendanceDate){
      let data = {
        employeeId: this.selectedUser,
        status: this.attendanceStatus,
        macAddress: 'admin-' + localStorage.getItem('id'),
        latitude: 0,
        longitude: 0,
        dateTime: this.attendanceDateTime
      }
    this.service.createAttendance(data).subscribe((res:any) => {
      if(res.success){
        this.alert.showAlert('success')
        this.getAttendance()
        this.closeDialog()
      }
    })
    }else{
      this.alert.showAlert('required' , 'bg-danger')
    }
  }
  closeDialog() {
    this.dialog.closeAll()
    this.attendanceDate = this.getDefaultTime();
  }

  getDefaultTime(): Date {
    const date = new Date();
    date.setHours(9, 0, 0, 0); // Set to 9:00 AM
    return date;
  }

  onDateChange($event: any) {
    this.newAttendanceDate = this.datePipe.transform($event , 'yyyy-MM-ddTHH:mm:00' , "UTC");
    let time = this.datePipe.transform($event , 'THH:mm:00' , "UTC");
    let dateTime = `${this.reportDate}${time}`
    this.attendanceDateTime = dateTime
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
        if (res.data.fromDay && res.data.toDay) {
          this.fromDay = res.data.fromDay;
          this.toDay = res.data.toDay;
          const month = (this.fromDay <= 15 && this.crossMonth) ? currentDate.getMonth()+1 : currentDate.getMonth();
          this.updateStartEndDates(currentDate, month);

          if(this.crossMonth){
            if(new Date(this.endDate) > currentDate){
              this.now = new Date();
              this.month = currentDate.getMonth()+1;
            }else{
              this.now = new Date(currentDate.getFullYear(), currentDate.getMonth()+1 , 1);
              this.month = currentDate.getMonth()+2;
            }
          } else {
            this.month = currentDate.getMonth() + 1;
          }
          this.getAttendance();
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

    private updateStartEndDates(baseDate: Date, month: number): void {
      try {
      const checkCrossMonth = this.crossMonth ? 1 : 0;
      this.startDate = this.datePipe.transform(
        new Date(baseDate.getFullYear(), month - checkCrossMonth, this.fromDay),
        'yyyy-MM-dd'
      );
      const endDay = this.crossMonth ? this.toDay : new Date(baseDate.getFullYear(), month+1, 0).getDate() ;

      this.endDate = this.datePipe.transform(
        new Date(baseDate.getFullYear(), month, endDay),
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
    this.showClearBtn = true;
    this.month = selectedDate.getMonth()+1;
    const month = (this.fromDay <= 15 && this.crossMonth) ? selectedDate.getMonth()+1 : selectedDate.getMonth();
    this.updateStartEndDates(selectedDate, month);
  }
  resetMonth() {
    this.setMonthAndYear(new Date());
    this.getAttendance();
    this.showClearBtn = false;

  }
}
