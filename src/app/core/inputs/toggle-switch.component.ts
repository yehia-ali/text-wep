import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'toggle-switch',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="flex aic" >
    <label 
        *ngIf="label && labelPosition === 'after' && showLabel" 
        class="flex aic fs-11 simibold mb-25 mr-1" 
        [for]="id"
        [class.pointer]="!disabled"
        (click)="!disabled && toggle()"
      >
        {{ label | translate }}
      </label>
      <label class="toggle-switch">
        <input
          type="checkbox"
          [id]="id"
          [checked]="value"
          [disabled]="disabled"
          (change)="onChange($event)"
        />
        <span class="slider"></span>
      </label>
      <label 
        *ngIf="label && labelPosition === 'before' && showLabel" 
        class="flex aic fs-11 simibold mb-25 ml-1" 
        [for]="id"
        [class.pointer]="!disabled"
        (click)="!disabled && toggle()"
      >
        {{ label | translate }}
      </label>
    </div>
  `,
  styles: [`
    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 20px;
      height: 16px;
      vertical-align: middle;
      margin-inline-end: 8px;

      input {
        opacity: 0;
        width: 0;
        height: 0;

        &:checked + .slider {
          background-color: #7B55D3;

          &:before {
            transform: translateX(-6px);
          }
        }

        &:disabled + .slider {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .slider {
        position: absolute;
        cursor: pointer;
        inset: 0;
        background-color: #999999;
        border-radius: 10px;
        transition: .2s;

        &:before {
          position: absolute;
          content: "";
          height: 10px;
          width: 10px;
          bottom: 3px;
          background-color: white;
          border-radius: 50%;
          transition: .2s;
          right: 2px;
        }
      }
    }

    [dir="rtl"] {
      .toggle-switch {
        .slider:before {
          right: auto;
          left: 2px;
        }

        input:checked + .slider:before {
          transform: translateX(6px);
        }
      }
    }

    .pointer {
      cursor: pointer;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleSwitchComponent),
      multi: true
    }
  ]
})
export class ToggleSwitchComponent implements ControlValueAccessor {
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Output() valueChange = new EventEmitter<boolean>();
  @Input() labelPosition: string = 'before';
  @Input() showLabel: boolean = true;
  value: boolean = false;
  private onChangeFn: (value: boolean) => void = () => {};
  private onTouchedFn: () => void = () => {};

  onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.checked;
    this.onChangeFn(this.value);
    this.onTouchedFn();
    this.valueChange.emit(this.value);
  }

  toggle(): void {
    if (!this.disabled) {
      this.value = !this.value;
      this.onChangeFn(this.value);
      this.onTouchedFn();
      this.valueChange.emit(this.value);
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: boolean): void {
    this.value = value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
} 