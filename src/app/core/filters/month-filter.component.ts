import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as moment from "moment/moment";
import {Moment} from "moment/moment";
import {BehaviorSubject} from "rxjs";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatDatepicker, MatDatepickerModule} from "@angular/material/datepicker";
import {TranslateModule} from "@ngx-translate/core";
import {MatInputModule} from "@angular/material/input";

let dir = document.dir;
let local;
if (dir === 'rtl') {
  local = 'ar-EG';
} else {
  local = 'en-GB';
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'MMMM/YYYY',
  },
  display: {
    dateInput: 'MMMM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'MMMM YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'month-filter',
  standalone: true,
  imports: [CommonModule, MatDatepickerModule, TranslateModule, MatInputModule, ReactiveFormsModule],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: local},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
  template: `
      <div class="start-date" [ngClass]="{'w-15r': displayLabel}">
          <label class="fs-13" *ngIf="displayLabel">{{'date' | translate}}</label>
          <div class="flex aic relative" (click)="picker.open()">
              <input class="input" [formControl]="date" [matDatepicker]="picker" [min]="min" [max]="max">
              <mat-datepicker-toggle matSuffix [for]="picker" class="picker-icon"></mat-datepicker-toggle>
              <mat-datepicker #picker startView="multi-year" (monthSelected)="setMonthAndYear($event, picker)" panelClass="example-month-picker">
              </mat-datepicker>
          </div>
      </div>

  `,
  styles: [`
    .picker-icon {
      position: absolute;
      inset-inline-end: 0;
    }

    .clear {
      position: absolute;
      inset-inline-end: 4rem;
      top: 50%;
      transform: translateY(-50%);
      line-height: 0;
    }

    .example-month-picker .mat-calendar-period-button {
      pointer-events: none;
    }

    .example-month-picker .mat-calendar-arrow {
      display: none;
    }
  `]
})
export class MonthFilterComponent implements OnInit, OnChanges {
  @Input() start_date_key!: BehaviorSubject<any>;
  @Input() displayLabel = true;
  @Input() end_date_key!: BehaviorSubject<any>;
  @Input() selectedDate: any; // Changed from BehaviorSubject<any> to any to handle both types
  @Output() onChange = new EventEmitter();
  date: any = new FormControl(moment())
  now = new Date();
  @Input() max!: Date;
  @Input() min!: Date;
  constructor() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate']) {
      this.date.setValue(moment(changes['selectedDate'].currentValue));
    }
  }
  ngOnInit(): void {
    // Handle selectedDate input - can be either a BehaviorSubject or a regular Date
    if (this.selectedDate) {
      if (this.selectedDate instanceof BehaviorSubject) {
        // If it's a BehaviorSubject, subscribe to it
        this.selectedDate.subscribe((res: any) => {
          if (res) {
            this.date.setValue(moment(res));
          }
        });
      } else {
        // If it's a regular Date or moment object, set it directly
        this.date.setValue(moment(this.selectedDate));
      }
    }
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue: any = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    const year = new Date(ctrlValue._d).getFullYear()
    const month = (new Date(ctrlValue._d).getMonth() + 1).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    });
    let lastDayOfMonth = new Date(ctrlValue._d.getFullYear(), ctrlValue._d.getMonth() + 1, 0).getDate();
    this.start_date_key?.next(`${year}-${month}-01`)
    this.end_date_key?.next(`${year}-${month}-${lastDayOfMonth}`);
    this.onChange.emit(ctrlValue._d);
    datepicker.close();
  }
}
