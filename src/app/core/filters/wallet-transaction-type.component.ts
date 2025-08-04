import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {NgSelectModule} from '@ng-select/ng-select';

@Component({
  selector: 'wallet-transaction-type',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, NgSelectModule],
  template: `
    <div class="transaction-type">
      <label class="fs-14">{{'transaction_type' | translate}}</label>
      <ng-select class="w-15r" appendTo="body" [items]="transactionTypes" bindLabel="title" bindValue="value" [(ngModel)]="selectedValue" (ngModelChange)="filter($event)">
        <ng-template ng-option-tmp let-item="item">
          <span>{{item.title | translate}}</span>
        </ng-template>
        <ng-template ng-label-tmp let-item="item" let-clear="clear">
          <span class="fs-14">{{item.title | translate}}</span>
        </ng-template>
      </ng-select>
    </div>
  `,
  styles: []
})
export class WalletTransactionTypeComponent {
  @Output() valueChanged = new EventEmitter();
  selectedValue = null;
  transactionTypes = [
    {title: 'debit', value: 0},
    {title: 'credit', value: 1},
  ]

  filter(event: any) {
    this.valueChanged.emit(event);
  }
}
