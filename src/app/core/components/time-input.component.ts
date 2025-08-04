import { CommonModule } from '@angular/common';
import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'time-input',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  template: `
    <input type="number" [(ngModel)]="hours" (focus)="onTouched()" [disabled]="disabled">
    <span>:</span>
    <input type="number" [(ngModel)]="minutes" (focus)="onTouched()" [disabled]="disabled">
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeInputComponent),
      multi: true,
    },
  ],
})
export class TimeInputComponent implements ControlValueAccessor {
  hours: number = 0;
  minutes: number = 0;
  disabled: boolean = false;

  public onChange: (value: number) => void = () => { };
  public onTouched: () => void = () => { };

  writeValue(value: number): void {
    if (value) {
      this.hours = Math.floor(value / 60);
      this.minutes = value % 60;
    }
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  updateValue() {

    const value = this.hours * 60 + this.minutes;
    this.onChange(value);
  }
}