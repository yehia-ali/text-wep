import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputLabelComponent } from "../inputs/input-label.component";
import { InputErrorComponent } from "../inputs/input-error.component";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";
import { OwlDateTimeModule } from "@danielmoncada/angular-datetime-picker";
import { ArabicDatePipe } from "../pipes/arabic-date.pipe";
    
@Component({
  selector: 'date-time-filter',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    InputLabelComponent, 
    InputErrorComponent, 
    MatButtonModule, 
    MatInputModule, 
    NgSelectModule, 
    FormsModule, 
    TranslateModule, 
    OwlDateTimeModule, 
    ArabicDatePipe,
  ],
  template: `
    <form [formGroup]="form">
        <!-- Single Date Input -->
        <div class="w-100">
          <input-label 
            [control]="f['date']" 
            *ngIf="!hideLabel"
            [key]="displayLabel"
          />
          <input 
            [owlDateTimeTrigger]="dt" 
            [owlDateTime]="dt" 
            class="input" 
            formControlName="date" 
            [min]="minDate || now"
            [max]="maxDate"
            [placeholder]="placeholder || (displayLabel | translate)"
            [disabled]="disabled"
            (change)="onDateChange()"
          />
          <input-error [control]="f['date']" />
        </div>
    </form>

    <!-- Date Time Picker -->
    <owl-date-time #dt></owl-date-time>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .flex-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .gap-y-1 {
      gap: 0.25rem 1rem;
    }

    .col-lg-12 {
      flex: 0 0 100%;
      max-width: 100%;
    }

    .input {
      width: 100%;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.2s ease;

      &:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
      }
    }
  `]
})
export class DateTimeFilterComponent implements OnInit {
  @Input() date: any = null;
  @Input() minDate: any = null;
  @Input() maxDate: any = null;
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() hideLabel: boolean = false;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() showTime: boolean = true;
  @Input() format: string = 'yyyy-MM-ddTHH:mm:ss';
  @Input() displayFormat: string = 'yyyy-MM-dd HH:mm';
  
  @Output() dateChange = new EventEmitter<any>();
  @Output() filterChange = new EventEmitter<any>();

  form!: FormGroup;
  lang = localStorage.getItem('language') || 'en';
  now = new Date();

  constructor(private fb: FormBuilder, private datePipe: DatePipe) {
    this.form = this.fb.group({
      date: [''],
    });
  }

  ngOnInit() {
    this.initializeForm();
    this.setupFormListeners();
  }

  private initializeForm() {
    let selectedDate: any;

    if (this.date) {
      selectedDate = this.date;
    } else {
      selectedDate = new Date();
    }

    this.form.patchValue({
      date: this.datePipe.transform(selectedDate, this.format),
    });

    // Set validators
    if (this.required) {
      this.form.get('date')?.setValidators([Validators.required]);
    }

    this.form.updateValueAndValidity();
  }

  private setupFormListeners() {
    this.form.valueChanges.subscribe(value => {
      this.emitChanges(value);
    });
  }

  private emitChanges(value: any) {
    const filterData = {
      date: value.date,
      isValid: this.form.valid
    };

    this.filterChange.emit(filterData);
    this.dateChange.emit(filterData);
  }

  onDateChange() {
    // Additional logic can be added here if needed
  }

  get f() {
    return this.form.controls;
  }

  get displayLabel(): string {
    if (this.label) return this.label;
    return 'date';
  }
} 