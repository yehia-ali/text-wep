import {Component, Inject, inject} from '@angular/core';
import {CommonModule, formatDate} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputErrorComponent} from "../../inputs/input-error.component";
import {InputLabelComponent} from "../../inputs/input-label.component";
import {SelectTimeComponent} from "../select-time.component";
import {FilterLabelComponent} from "../../filters/filter-label.component";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import {MatButtonModule} from "@angular/material/button";
import {SubmitButtonComponent} from "../submit-button.component";
import {TaskDetailsService} from "../../services/task-details.service";
import {AlertService} from "../../services/alert.service";

let dir = document.dir;
let local;
if (dir === 'rtl') {
  local = 'ar-EG';
} else {
  local = 'en-GB';
}


@Component({
  selector: 'log-time',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatDialogModule, InputErrorComponent, InputLabelComponent, SelectTimeComponent, ReactiveFormsModule, FilterLabelComponent, MatDatepickerModule, MatFormFieldModule, FormsModule, MatButtonModule, SubmitButtonComponent],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: local},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
  templateUrl: './log-time.component.html',
  styleUrls: ['./log-time.component.scss']
})
export class LogTimeComponent {
  service = inject(TaskDetailsService);
  dialog = inject(MatDialog);
  alert = inject(AlertService);
  form: FormGroup;
  hours = 0;
  minutes = 0;
  today = new Date();
  loading = false;


  constructor(private fb: FormBuilder , @Inject(MAT_DIALOG_DATA) public data:any , private dialogRef: MatDialogRef<LogTimeComponent>) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      hours: ['', Validators.required],
      minutes: ['', Validators.required],
      date: [new Date(), Validators.required]
    })
  }

  setLogTime(time: any) {
    this.f['minutes'].markAsTouched()
    this.form.patchValue({
      hours: Math.floor(time / 60),
      minutes: time % 60
    })
  }

  submit() {
    let now = new Date();
    let utcOffset: any = new Date().getTimezoneOffset();
    let time  = (now.getHours() + (utcOffset / 60)) <= 0 ? (now.getHours() + 12 + (utcOffset / 60)) : (now.getHours() + (utcOffset / 60));
    console.log(time)
    if (this.form.valid) {
      this.loading = true;
      let data = {
        taskId: this.data || this.service.id.value,
        ...this.form.value,
        date: formatDate(this.form.value.date, `yyyy-MM-ddT${time.toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`, 'en-US') + 'Z'
      }
      this.service.logTime(data).subscribe((res: any) => {
        if (res.success) {
          this.alert.showAlert('log_added');
          this.dialogRef.close();
          this.service.hasChanged.next(true)
        } else {
          this.loading = false;
        }
      })
    }
  }

  get f() {
    return this.form.controls;
  }
}
