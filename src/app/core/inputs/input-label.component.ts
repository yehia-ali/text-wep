import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {AbstractControl} from "@angular/forms";
import {MaxLengthComponent} from "../components/max-length.component";

@Component({
  selector: 'input-label',
  standalone: true,
  imports: [CommonModule, TranslateModule, MaxLengthComponent],
  template: `
    <div [ngClass]="{'danger': control?.errors && control?.touched}" class="{{classes}} mb-25 flex aic jcsb">
      <p class="flex aic fs-11 simibold mb-25">
        <img *ngIf="showIcon" [src]="icon" class="mr-1" [ngClass]="iconClass" width="16" height="16" [alt]="key | translate">
        <span>{{key | translate}}</span>
        <i *ngIf="optional" class="ml-50">( {{'optional' | translate}} )</i>
      </p>
      <max-length *ngIf="maxLength" [maxLength]="maxLength" [currentLength]="control?.value.length"/>
    </div>
  `,
  styles: [
  ]
})
export class InputLabelComponent {
  @Input() key!: string;
  @Input() optional = false;
  @Input() classes = 'fs-11';
  @Input() control?: AbstractControl;
  @Input() maxLength!: number;
  @Input() showIcon = false;
  @Input() icon?: string;
  @Input() iconClass?: string;
}
