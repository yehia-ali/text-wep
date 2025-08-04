import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, formatDate} from '@angular/common';
import {BidiModule} from "@angular/cdk/bidi";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputLabelComponent} from "../../../../core/inputs/input-label.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {LeavesRequestsService} from "../../../../core/services/leaves-requests.service";
import {InputErrorComponent} from "../../../../core/inputs/input-error.component";
import { AngularEditorModule} from "@kolkov/angular-editor";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {SubmitButtonComponent} from "../../../../core/components/submit-button.component";
import {GetAttachmentsComponent} from "../../../../core/components/get-attachments.component";
import {LeaveFormService} from "../../../../core/services/leave-form.service";
import {AlertService} from "../../../../core/services/alert.service";
import {LeavesDashboardService} from "../../../../core/services/leaves-dashboard.service";
import {ArabicNumbersPipe} from "../../../../core/pipes/arabic-numbers.pipe";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { enumToArray } from 'src/app/core/functions/enum-to-array';
import { HalfDayLeaveTypes } from 'src/app/core/enums/half-day-leave-types';
import { PermissionDayCount } from 'src/app/core/enums/permission-day-count';
import { DateTimeFilterComponent } from 'src/app/core/filters/date-time-filter.component';

let dir = document.dir;
let local;
if (dir === 'rtl') {
  local = 'ar-EG'
} else {
  local = 'en-GB';
}

@Component({
  selector: 'leave-form',
  standalone: true,
  imports: [MatCheckboxModule,CommonModule, BidiModule, MatDialogModule, TranslateModule, ReactiveFormsModule, InputLabelComponent, NgSelectModule, InputErrorComponent, AngularEditorModule, MatButtonModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, SubmitButtonComponent, GetAttachmentsComponent, ArabicNumbersPipe, DateTimeFilterComponent],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: local},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {dateInput: 'LL'},
        display: {
          dateInput: 'LL',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
  ],
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.scss']
})
export class LeaveFormComponent implements OnInit {

selectedLeaveType:any
  form!: FormGroup;
  service = inject(LeaveFormService)
  halfDayLeaveTypes = enumToArray(HalfDayLeaveTypes);
  permissionDayCount = enumToArray(PermissionDayCount);
  leaveTypes: any[] = [];
  leaveRequestsSer = inject(LeavesRequestsService);
  leaveDashboardSer = inject(LeavesDashboardService)
  daysNumber = 0;
  attachments = []
  loading = false;
  alert = inject(AlertService);
  dialog = inject(MatDialog);
  today = new Date();
  dataLoaded = false;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      leave_type_id: [null, Validators.required],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      leave_reason: [''],
      leaveType: ['full_day', [Validators.required]],
      half_day_leave: [false],
      isPermission: [false],
      permissionDayCount: [0],
      half_day_Morning: [null],
    });
  }

  ngOnInit() {
    this.leaveRequestsSer.getUserLeaveTypes().subscribe((res: any) => {
      this.leaveTypes = res.data;
      this.dataLoaded = true
    });
  }

  onLeaveTypeChange(type: string) {
    // Reset related form controls based on selection
    switch(type) {
      case 'full_day':
        this.form.patchValue({
          half_day_leave: false,
          isPermission: false,
          half_day_Morning: null,
          permissionDayCount: 0
        });
        // Reset validation for full day
        this.form.get('end_date')?.setValidators([Validators.required]);
        this.form.get('leaveType')?.setValidators([Validators.required]);
        this.form.get('leave_type_id')?.setValidators([Validators.required]);
        this.form.get('half_day_Morning')?.clearValidators();
        this.form.get('permissionDayCount')?.clearValidators();

        // Update validity for each control
        this.form.get('end_date')?.updateValueAndValidity();
        this.form.get('leaveType')?.updateValueAndValidity();
        this.form.get('leave_type_id')?.updateValueAndValidity();
        this.form.get('half_day_Morning')?.updateValueAndValidity();
        this.form.get('permissionDayCount')?.updateValueAndValidity();

        break;
      case 'half_day':
        this.form.patchValue({
          half_day_leave: true,
          isPermission: false,
          permissionDayCount: 0,
          end_date: null // Clear end_date for half_day
        });
        // Add validation for half day morning selection
        this.form.get('half_day_Morning')?.setValidators([Validators.required]);
        this.form.get('start_date')?.setValidators([Validators.required]);
        this.form.get('leaveType')?.setValidators([Validators.required]);
        this.form.get('leave_type_id')?.setValidators([Validators.required]);
        this.form.get('permissionDayCount')?.clearValidators();
        this.form.get('end_date')?.clearValidators(); // Remove end_date validation for half_day
        
        // Update validity for each control
        this.form.get('half_day_Morning')?.updateValueAndValidity();
        this.form.get('start_date')?.updateValueAndValidity();
        this.form.get('leaveType')?.updateValueAndValidity();
        this.form.get('leave_type_id')?.updateValueAndValidity();
        this.form.get('permissionDayCount')?.updateValueAndValidity();
        this.form.get('end_date')?.updateValueAndValidity();
        
        break;
      case 'permission':
        this.form.patchValue({
          half_day_leave: false,
          isPermission: true,
          half_day_Morning: null,
          leave_type_id: 5977
        });
        // Add validation for permission day count
        this.form.get('permissionDayCount')?.setValidators([Validators.required]);
        this.form.get('leaveType')?.clearValidators();
        this.form.get('half_day_Morning')?.clearValidators();
        
        // Update validity for each control
        this.form.get('permissionDayCount')?.updateValueAndValidity();
        this.form.get('leaveType')?.updateValueAndValidity();
        this.form.get('half_day_Morning')?.updateValueAndValidity();
        
        break;
    }
  }

  // Handle single date selection for half_day
  onHalfDayDateChange(event: any) {
    if (event && event.value) {
      // Set both start_date and end_date to the same date for half_day
      this.form.patchValue({
        start_date: event.value,
        end_date: event.value
      });
      this.daysNumber = 0.5; // Half day is always 0.5 days
    }
  }

  onDateTimeChange(event: any) {
    if (event && event.date) {
      this.form.controls['start_date'].setValue(event.date);
      this.form.controls['end_date'].setValue(event.date);
    }
  }

  dateChanged() {
    if(!this.form.value.end_date ){
      this.form.value.end_date = this.form.value.start_date
      this.form.patchValue({
        ...this.form.value
      })
    }
    if(this.form.value.leaveType == 'full_day') {
      this.daysNumber = (new Date(this.form.value.end_date).getTime() - new Date(this.form.value.start_date).getTime()) / (1000 * 60 * 60 * 24) + 1;
    }
    else if(this.form.value.leaveType == 'half_day') {
      // For half_day, both start_date and end_date should be the same
      if (this.form.value.start_date) {
        this.form.patchValue({
          end_date: this.form.value.start_date
        });
      }
      this.daysNumber = 0.5; // Half day is always 0.5 days
    }
  }
  selectHalfDayLeaveType($event: any) {
    if($event.value == 1){
      this.form.controls['half_day_Morning'].setValue(true)
    }else{
      this.form.controls['half_day_Morning'].setValue(false)
    }

  }
  selctedLeaveTypeValue($event: any) {
    this.selectedLeaveType = $event

  }
  submit() {
    this.loading = true;
    
    // Determine leave type based on form values
    const leaveType = this.form.value.leaveType;
    let isPermission = false;
    let halfDayLeave = false;
    
    switch(leaveType) {
      case 'permission':
        isPermission = true;
        halfDayLeave = false;
        break;
      case 'half_day':
        isPermission = false;
        halfDayLeave = true;
        break;
      case 'full_day':
      default:
        isPermission = false;
        halfDayLeave = false;
        break;
    }
    
    const formData = {
      ...this.form.value,
      isPermission: isPermission,
      half_day_leave: halfDayLeave,
      start_date: leaveType == "permission" ? formatDate(new Date(this.form.value.start_date), 'yyyy-MM-ddTHH:mm', 'en-US') : formatDate(new Date(this.form.value.start_date), 'yyyy-MM-dd', 'en-US'),
      end_date: leaveType == "permission" ? formatDate(new Date(new Date(this.form.value.start_date).getTime() + (this.form.value.permissionDayCount * 8 * 60 * 60 * 1000)), 'yyyy-MM-ddTHH:mm', 'en-US') : formatDate(new Date(this.form.value.end_date), 'yyyy-MM-dd', 'en-US'),
      ...(this.attachments.length > 0 && {leaveAttachments: this.getAttachments()})
    };

    // Filter out null values
    const data = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => value !== null && value !== undefined)
    );
    this.service.submitLeave(data).subscribe((res: any) => {
      if (res.success) {
        if (res.data.length > 0) {
          let number = 0;
          this.alert.showAlert('files_uploading', 'bg-primary', 500000000000000);
          const uploadAttachment = (file: any, id: any) => {
            let formData = new FormData();
            formData.append("uploadedFiles", file);
            this.service.uploadAttachments(formData, id).subscribe(() => {
              number++;
              if (res.data.length == number) {
                this.afterRequestCreation();
              }
            });
          }

          for (let i = 0; i < res.data.length; i++) {
            uploadAttachment(this.attachments[i], res.data[i].id);
            number++;
            if (res.data.length == number) {
              this.afterRequestCreation();
            }
          }
        } else {
          this.afterRequestCreation()
        }
      } else {
        this.loading = false;
      }
    }, () => this.loading = false)
  }

  afterRequestCreation() {
    this.alert.showAlert('leave_created_success');
    this.dialog.closeAll();
    this.leaveDashboardSer.hasChanged.next(true)
  }


  getAttachments() {
    let spaceId = localStorage.getItem('space-id')
    return this.attachments.map((file: any) => {
      let fileType = 6;
      let filePath = 'Companies/' + spaceId + '/Attachments\\';
      if (file.type.includes("image")) fileType = 2;
      else if (file.type.includes("video")) fileType = 4;
      else if (file.type.includes("text")) fileType = 1;
      else if (file.type.includes("audio")) fileType = 3;
      return {filePath, contentType: "string", fileName: file.name, fileSize: file.size, fileType};
    }).filter(Boolean);
  }

  get f() {
    return this.form.controls;
  }

/*  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '100px',
    minHeight: '5rem',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    customClasses: [
      {
        name: 'Quote',
        class: 'quoteClass',
      },
      {
        name: 'Title Heading',
        class: 'titleHead',
        tag: 'h1',
      },
    ],
  };*/

}
