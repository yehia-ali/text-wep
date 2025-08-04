import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputLabelComponent} from "../../inputs/input-label.component";
import {InputErrorComponent} from "../../inputs/input-error.component";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslateModule} from "@ngx-translate/core";
import {RecordComponent} from "../record/record.component";
import {OwlDateTimeModule} from "@danielmoncada/angular-datetime-picker";
import { ArabicDatePipe } from "../../pipes/arabic-date.pipe";

@Component({
  selector: 'create-task-timing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputLabelComponent, InputErrorComponent, MatButtonModule, MatInputModule, NgSelectModule, FormsModule, TranslateModule, RecordComponent, OwlDateTimeModule, ArabicDatePipe],
  templateUrl: './create-task-timing.component.html',
  styles: [`
    .start-date, .end-date {
      .icon {
        position: absolute;
        top: 52%;
        transform: translateY(-50%);
        inset-inline-end: 0
      }
    }
  `]
})
export class CreateTaskTimingComponent implements OnInit {
  @Input() isTicketing = false;
  @Input() isMeeting = false;
  @Input() startDate :any = null;
  @Input() endDate :any = null;
  @Input() more = false;
  @Input() isEdit = false;
  @Input() soundUrl: any;
  @Output() getTimeForm = new EventEmitter();
  @Output() soundDescription = new EventEmitter();
  maxValue: any;
  form!: FormGroup;
  lang = localStorage.getItem('language') || 'en';
  now = new Date(new Date().setMinutes(new Date().getMinutes() + 5));
  repeat = 0;
  isDaily!: boolean;
  isCustom!: boolean;
  repeatIntervalNumber = 2;
  isRepeated = false;
  selectedDays = [1, 2, 3, 4, 5, 6, 7];
  diffInDays!: number;
  repeatList: any = [
    {name: "no_repeat", value: 0},
    {name: "daily", value: 1},
    {name: "weekly", value: 2},
    {name: "monthly", value: 3},
    {name: "yearly", value: 4},
    {name: "custom", value: 5},
  ];
  daysList = [
    {name: 'sunday', value: 0},
    {name: "monday", value: 1},
    {name: "tuesday", value: 2},
    {name: "wednesday", value: 3},
    {name: "thursday", value: 4},
    {name: "friday", value: 5},
    {name: "saturday", value: 6},
  ];
  customRepeatList: any = [
    {name: "weeks", value: 2},
    {name: "months", value: 3},
    {name: "years", value: 4},
  ];

  constructor(private fb: FormBuilder , private datePipe : DatePipe) {
    this.form = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      isRepeated: [false, Validators.required],
      taskRepeatedPeriod: [null],
      repeatedPeriodNumber: [2, [Validators.min(1)]],
      repetitionSelectedDays: [null],
      endTimeForRepeat: [null],
    })
  }

  ngOnInit() {
    let startDate :any;
    let endDate :any;

    if(this.startDate && this.endDate){
      startDate = this.startDate
      endDate = this.endDate
    }else{
      startDate = new Date()
      endDate = new Date()
      startDate.setMinutes(startDate.getMinutes() + 5); // Add 5 minutes to current time
      endDate.setHours(endDate.getHours() + 3); // Add 1 hour to the start date
    }
    this.form.patchValue({
      startDate: this.datePipe.transform(startDate, 'yyyy-MM-ddTHH:mm:ss'),
      endDate: this.datePipe.transform(endDate, 'yyyy-MM-ddTHH:mm:ss'),
    });
    this.f['endDate'].valueChanges.subscribe(res => {
      this.repeat = 0;
      this.isRepeated = false;
      this.isDaily = false;
      this.isCustom = false;
      this.repeatInterval();
      this.form.patchValue({isRepeated: false})
      this.resetEndTimeForRepeat();
    });
    this.isRepeatedFun();
    this.getTimeForm.emit(this.form);
    this.form.valueChanges.subscribe(() => {
      this.getTimeForm.emit(this.form);
    });
    this.startDateChanged();
  }

  repeatChange($event: any) {
    if ($event == 1) {
      this.isDaily = true;
      this.selectedDays = [0, 1, 2, 3, 4, 5, 6];
      this.f['repetitionSelectedDays'].setValidators(Validators.required);
      this.form.updateValueAndValidity();
      this.form.patchValue({
        repetitionSelectedDays: this.selectedDays,
        taskRepeatedPeriod: 1
      });
    } else {
      this.isDaily = false;
      this.selectedDays = [];
      this.f['repetitionSelectedDays'].removeValidators(Validators.required);
      this.form.updateValueAndValidity();
      this.form.patchValue({repetitionSelectedDays: null});
    }
    if ($event == 2) {
      this.form.patchValue({
        taskRepeatedPeriod: 2
      })
    }
    if ($event == 3) {
      this.form.patchValue({
        taskRepeatedPeriod: 3
      })
    }
    if ($event == 4) {
      this.form.patchValue({
        taskRepeatedPeriod: 4
      })
    }
    if ($event == 5) {
      this.isCustom = true;
      if (this.isCustom) {
        if (this.diffInDays < 7) {
          this.form.patchValue({
            taskRepeatedPeriod: 2
          })
        }
        if (this.diffInDays < 30 && this.diffInDays > 7) {
          this.form.patchValue({
            taskRepeatedPeriod: 3
          })
        }
        if (this.diffInDays < 365 && this.diffInDays > 30) {
          this.form.patchValue({
            taskRepeatedPeriod: 4
          })
        }
      }
      this.form.patchValue({
        repeatedPeriodNumber: 2,
      });
    } else {
      this.form.patchValue({
        repeatedPeriodNumber: 1,
      })
      this.repeatIntervalNumber = 0
      this.isCustom = false;
    }
    if ($event != 0) {
      this.isRepeated = true;
      this.resetEndTimeForRepeat()
      this.form.patchValue({
        isRepeated: true
      })
    } else {
      this.isRepeated = false;
      this.form.patchValue({
        isRepeated: false
      })
    }
  }


  isRepeatedFun() {
    this.f['isRepeated'].valueChanges.subscribe(value => {
      setTimeout(() => {
        if (value) {
          //form Validation Required if is repeated checked
          this.f['endTimeForRepeat'].setValidators(Validators.required);
          this.f['endTimeForRepeat'].updateValueAndValidity();
          this.f['taskRepeatedPeriod'].setValidators(Validators.required);
          this.f['taskRepeatedPeriod'].updateValueAndValidity();
        } else {
          this.f['endTimeForRepeat'].clearValidators();
          this.f['endTimeForRepeat'].updateValueAndValidity();
          this.f['taskRepeatedPeriod'].clearValidators();
          this.f['taskRepeatedPeriod'].updateValueAndValidity();
        }
        this.form.updateValueAndValidity()
      }, 10)
    });
  }

  repeatInterval() {
    let diffInTime = this.f['endDate'].value - this.f['startDate'].value;
    this.diffInDays = diffInTime / (1000 * 3600 * 24);
    this.repeatList = [
      {name: "no_repeat", value: 0},
      this.diffInDays < 1 && {name: "daily", value: 1},
      this.diffInDays < 7 && {name: "weekly", value: 2},
      this.diffInDays < 30 && {name: "monthly", value: 3},
      this.diffInDays < 360 && {name: "yearly", value: 4},
      {name: "custom", value: 5},
    ].filter(Boolean);

    this.customRepeatList = [
      this.diffInDays < 7 && {name: "weeks", value: 2},
      this.diffInDays < 30 && {name: "months", value: 3},
      this.diffInDays < 360 && {name: "years", value: 4},
    ].filter(Boolean);
  }

  resetEndTimeForRepeat() {
    this.form.patchValue({
      endTimeForRepeat: null
    });
  }

  startDateChanged() {
    this.f['startDate'].valueChanges.subscribe(res => {
      this.maxValue = new Date(new Date(this.f['startDate'].value).setHours(new Date(this.f['startDate'].value).getHours() + 23))
      this.form.patchValue({
        endDate: '',
        isRepeated: false,
        taskRepeatedPeriod: null,
        repeatedPeriodNumber: 2,
        repetitionSelectedDays: null,
        endTimeForRepeat: null,
      })
      this.isRepeated = false;
      this.isDaily = false;
      this.isCustom = false;
      this.repeat = 0;
    });
  }

  get f() {
    return this.form.controls;
  }
}
