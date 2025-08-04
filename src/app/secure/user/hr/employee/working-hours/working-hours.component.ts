import { Component } from '@angular/core';
import { InputLabelComponent } from '../../../../../core/inputs/input-label.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { AllShiftsComponent } from 'src/app/core/filters/all-shifts.component';
import { WorkingHoursFormComponent } from '../forms-component/working-hours-form/working-hours-form.component';
import { CommonModule, DatePipe } from '@angular/common';
import { ArabicDatePipe } from '../../../../../core/pipes/arabic-date.pipe';
import { ArabicTimePipe } from '../../../../../core/pipes/arabic-time.pipe';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SubmitButtonComponent } from '../../../../../core/components/submit-button.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'working-hours',
  templateUrl: './working-hours.component.html',
  standalone: true,
  styleUrls: ['./working-hours.component.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    InputLabelComponent,
    TranslateModule,
    NgSelectModule,
    FormsModule,
    AllShiftsComponent,
    CommonModule,
    ArabicDatePipe,
    ArabicTimePipe,
    MatCheckboxModule,
    SubmitButtonComponent,
    MatButtonModule
  ],
})
export class WorkingHoursComponent {
  loading: boolean;

  userShiftId: any;
  employeeId: any = this.route.snapshot.params['id'];
  allDays: any;
  shiftId: any = 0;
  saveUserShift: boolean = false;
  constructor(
    private service: HrEmployeesService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private alert: AlertService
  ) {}

  ngOnInit() {
    this.getUserShift()
  }

  getUserShift(){
    this.service.getUserShifts(this.employeeId).subscribe((res: any) => {
      this.shiftId = res.data.id;
      this.userShiftId = res.data.id;
      this.getShiftDayes();
    });
  }

  addWorkingHours() {
    const dialogRef = this.dialog.open(WorkingHoursFormComponent, {
      width: '700px',
      panelClass: 'visible-dialog-container',
      data: {
        employeeId: this.employeeId,
        disableUser: true,
        days: this.allDays,
        shiftId: this.shiftId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      if (result === true) {
        this.getShiftDayes();
      }
    });

    this.getShiftDayes();
  }

  // getAllDayes() {
  //   this.allDays = null
  //   this.service.getEmployeeDays(this.employeeId).subscribe((res: any) => {
  //     this.allDays = res
  //   });
  // }
  changeShift(newShiftId: any) {
    this.shiftId = newShiftId;
    if(!this.shiftId){
      this.shiftId = this.userShiftId
    }else{
      this.getShiftDayes();
      if (this.shiftId != this.userShiftId) {
        this.saveUserShift = true;
      } else {
        this.saveUserShift = false;
      }
    }
  }

  getShiftDayes() {
    this.allDays = null;
    this.service.getShiftDays(this.shiftId).subscribe((res: any) => {
      this.allDays = res;
    });
  }

  weekendChanged(event: any) {
    console.log(event);
    let data = {
      weekDay: event.weekDay,
      checkInTime: this.datePipe.transform(new Date() , 'yyyy-MM-ddThh-mm-00Z'),
      checkOutTime: this.datePipe.transform(new Date() , 'yyyy-MM-ddThh-mm-00Z'),
      checkInAllowance: 0,
      checkOutAllowance: 0,
      workingHours: 0,
      earlyCheckIn: 0,
      long: 0,
      lat: 0,
      radius: 0,
      preventChackin: false,
      isWeekEnd: true,
      shiftId: this.shiftId,
    };
    this.service.createShiftDay(data).subscribe((res: any) => {
      console.log(res);
      this.alert.showAlert('weekend_added_success');
      this.getShiftDayes();
    });
  }

  addUserToShift() {
    let data = {
      usersId: [Number(this.employeeId)],
      shiftId: this.shiftId,
    };
    this.service.addUserToShift(data).subscribe((res: any) => {
      if (res.success) {
        this.alert.showAlert('users_added_to_shift');
        this.getUserShift()
        this.saveUserShift = false
      }
    });
  }
}
