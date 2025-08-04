import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ArabicNumbersPipe} from "../pipes/arabic-numbers.pipe";

@Component({
  selector: 'field-length',
  standalone: true,
  imports: [CommonModule, ArabicNumbersPipe],
  template: `
    <p class="muted fs-12">
      <span *ngIf="length">{{length | arabicNumbers}}</span>
      <span *ngIf="max && length">/</span>
      <span *ngIf="max">{{max | arabicNumbers}}</span>
      <span *ngIf="percentage">{{percentage | arabicNumbers}} %</span>
    </p>
  `,
  styles: [
  ]
})
export class FieldLengthComponent {
  @Input() length!: number;
  @Input() max!: number;
  @Input() percentage!: number;
}
