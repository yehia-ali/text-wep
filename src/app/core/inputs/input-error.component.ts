import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {AbstractControl} from "@angular/forms";

@Component({
  selector: 'input-error',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <p class="danger fs-11 text-left">
      <span *ngIf="control?.errors?.['required'] && control.touched">{{'required' | translate}}</span>
      <span *ngIf="control?.errors?.['minlength'] && control.touched">{{'min_length_error' | translate}} {{control.errors?.['minlength']?.requiredLength}} {{'least_characters' | translate}}</span>
      <span *ngIf="control?.errors?.['maxlength'] && control.touched">{{'max_length_error' | translate}} {{control.errors?.['maxlength']?.requiredLength}} {{'most_characters' | translate}}</span>
      <span *ngIf="control?.errors?.['email'] && control.touched">{{'email_error' | translate}}</span>
      <span *ngIf="control?.errors?.['max'] && control.touched">{{'max_error_number' | translate: { max: control.errors?.['max']?.max } }}</span>
      <span *ngIf="control?.errors?.['min'] && control.touched">{{'min_error_number' | translate: { min: control.errors?.['min']?.min } }}</span>
      <span *ngIf="control?.errors?.['pattern'] && control.touched">{{'pattern_error' | translate}}</span>
      <span *ngIf="control?.errors?.['validatePhoneNumber'] && control.touched">{{'invalid_phone' | translate}}</span>
      <span *ngIf="control?.errors?.['notMatched'] && control.touched">{{'notMatched' | translate}}</span>
      <span class="danger" *ngIf="control?.errors?.['min'] && control.touched">{{message ? message : ('min_error' | translate)  }}</span>
    </p>

  `,
  styles: []
})
export class InputErrorComponent {
  @Input() control!: AbstractControl;
  @Input() message!: string;
}
