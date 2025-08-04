import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputLabelComponent } from 'src/app/core/inputs/input-label.component';
import { OvertimeService } from 'src/app/core/services/overtime.service';
import { InputErrorComponent } from 'src/app/core/inputs/input-error.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SubmitButtonComponent } from 'src/app/core/components/submit-button.component';
import { AlertService } from 'src/app/core/services/alert.service';
import { OvertimeDashboardService } from 'src/app/core/services/overtime-dashboard.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { SelectTimeComponent } from 'src/app/core/components/select-time.component';
import { AppDropdownComponent } from "../../../../../core/components/primeng-components/project-filter/prime-dropdown.component";
import { HttpParams } from '@angular/common/http';
import { DateFilterComponent } from "../../../../../core/filters/date-filter.component";
let dir = document.dir;
let local;
if (dir === 'rtl') {
  local = 'ar-EG';
} else {
  local = 'en-GB';
}

@Component({
  selector: 'overtime-form',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule,
    ReactiveFormsModule,
    InputLabelComponent,
    InputErrorComponent,
    MatButtonModule,
    MatFormFieldModule,
    SubmitButtonComponent,
    MatDatepickerModule,
    MatInputModule,
    SelectTimeComponent,
    AppDropdownComponent,
    DateFilterComponent
],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: local },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: { dateInput: 'LL' },
        display: {
          dateInput: 'LL',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
  ],
  templateUrl: './overtime-form.component.html',
  styleUrls: ['./overtime-form.component.scss'],
})
export class OvertimeFormComponent implements OnInit {
  dateChange($event: any) {
    this.selectedDate = $event
    console.log(this.selectedDate);
    this.form.patchValue({
      date: (this.selectedDate = formatDate(
        new Date(this.selectedDate),
        'YYYY-MM-dd',
        'en-US'
      )),
    })
  }
  searchValue: any;
  selectedDate :any
  valueChanged(event:any) {
    this.selectedTask = event
  }

  searchTask(event:any) {
    this.searchValue = event
    this.getUserTasks()
  }

  hours = 0;
  minutes = 0;
  form!: FormGroup;
  overtimeRequestsSer = inject(OvertimeService);
  overtimeDashboardSer = inject(OvertimeDashboardService);
  daysNumber = 0;
  loading = false;
  time: any;
  alert = inject(AlertService);
  dialog = inject(MatDialog);
  today = new Date();
  dataLoaded = false;
  todayDate:Date = new Date();
  tasks: any[] = [];
  selectedTask:any

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title:  ['', [Validators.required , Validators.maxLength(100)]],
      date:   ['', [Validators.required , Validators.maxLength(250)]],
      reason: ['', [Validators.maxLength(500)]],
      hours:  ['', [Validators.required]],
    });
  }
  ngOnInit() {
    this.getUserTasks()
  }

  getUserTasks(){
    let userId:any = localStorage.getItem('id')
    let params = new HttpParams().set('page' , 1).set('limit' , 30).set('userId' , userId)
    if(this.searchValue){
      params = params.set('search' , this.searchValue)
    }
    this.overtimeRequestsSer.getUserTasks(params).subscribe((res:any) => {
      if(res.success){
        this.tasks = res.data.items
      }
    })
  }

  submit() {
    this.loading = true;

    let data: any = {
      ...this.form.value,
      hours: this.form.value.hours / 60 ,
    };

    if (this.selectedTask){
      data.taskId = this.selectedTask.taskId;
    }

    if(data.hours < 0.5){
      this.alert.showAlert('min_hours' , 'bg-danger')
      this.loading = false
    }else{
      this.overtimeRequestsSer.requestOverTime(data).subscribe(
        (res: any) => {
          if (res.success) {
            this.afterRequestCreation();
          }else{
            this.loading = false
          }
        },
        (error: any) => {
          this.alert.showAlert(error, 'bg-danger');
        }
      );
    }
  }
  checkLength(controlName: any, maxLength: any, message: any) {
    const controlValue = this.form.get(controlName)?.value;
    if (controlValue && controlValue.length >= maxLength) {
      this.alert.showAlert(message, 'bg-danger');
    }
  }
  afterRequestCreation() {
    this.alert.showAlert('overtime_created_success', 'bg-success');
    this.dialog.closeAll();
    this.overtimeDashboardSer.hasChanged.next(true);
  }

  setTime($event: any) {
    this.form.patchValue({
      hours: $event,
    });
  }

  get f() {
    return this.form.controls;
  }
}
