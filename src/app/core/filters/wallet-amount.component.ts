import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'wallet-amount',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  template: `
    <div class="flex aic gap-x-2">
      <div class="min w-11r">
        <label class="fs-14">{{'minimum' | translate}} ({{'egp' | translate}})</label>
        <input type="number" class="input" [(ngModel)]="minValue" (input)="onChange()">
      </div>
      <div class="max w-11r">
        <label class="fs-14">{{'maximum' | translate}} ({{'egp' | translate}})</label>
        <input type="number" class="input" [(ngModel)]="maxValue" (input)="onChange()">
      </div>
    </div>
  `,
  styles: []
})
export class WalletAmountComponent {
  @Output() valueChanged = new EventEmitter();
  minValue!: any;
  maxValue!: any;

  onChange() {
    this.valueChanged.emit({minValue: this.minValue, maxValue: this.maxValue});
  }
}
