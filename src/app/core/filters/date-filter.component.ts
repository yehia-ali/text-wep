import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilterLabelComponent} from "./filter-label.component";
import {FormsModule} from "@angular/forms";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter,} from '@angular/material-moment-adapter';
import {MatInputModule} from "@angular/material/input";
import { TranslateModule } from '@ngx-translate/core';

let dir = document.dir;
let local;
if (dir === 'rtl') {
  local = 'ar-EG';
} else {
  local = 'en-GB';
}

@Component({
  selector: 'date-filter',
  standalone: true,
  imports: [CommonModule, FilterLabelComponent, FormsModule, MatDatepickerModule, MatInputModule , TranslateModule],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: local},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
  template: `
    <div  class="date_filter {{width}} {{classes}}">
      <filter-label *ngIf="!hideLabel" [key]="key"/>
      <div (click)="!readOnly && picker.open()" class="flex aic relative">
        <input [(ngModel)]="selectedValue" [readonly]="readOnly" [matDatepicker]="picker" class="input" (ngModelChange)="changeValue($event)" [min]="minDate" [placeholder]="key | translate">
        <div (click)="$event.stopImmediatePropagation(); selectedValue = ''; changeValue('')" *ngIf="selectedValue && clearable" class="clear pointer danger">
          <i class='bx bx-x fs-23'></i>
        </div>
        <mat-datepicker-toggle [for]="picker" *ngIf="!readOnly" class="picker-icon" matSuffix></mat-datepicker-toggle>
        <mat-datepicker #picker [disabled]="false"></mat-datepicker>
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
    .input:read-only {
      background-color: #f5f5f5;
      border: 1px solid #f5f5f5 !important;
    }

  `]
})
export class DateFilterComponent {
  @Output() valueChanged = new EventEmitter();
  @Input() key = '';
  @Input() selectedValue: any = '';
  @Input() minDate = '';
  @Input() classes = '';
  @Input() width = 'w-16r';
  @Input() clearable = true;
  @Input() readOnly = false;
  @Input() hideLabel = false;

  changeValue(event: any) {
    this.valueChanged.emit(event);
  }
}
