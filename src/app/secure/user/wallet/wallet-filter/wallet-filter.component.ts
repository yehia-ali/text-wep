import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchComponent} from "../../../../core/filters/search.component";
import {WalletService} from "../../../../core/services/wallet.service";
import {WalletTypeComponent} from "../../../../core/filters/wallet-type.component";
import {WalletAmountComponent} from "../../../../core/filters/wallet-amount.component";
import {WalletTransactionTypeComponent} from "../../../../core/filters/wallet-transaction-type.component";
import {DateFilterComponent} from "../../../../core/filters/date-filter.component";

@Component({
  selector: 'wallet-filter',
  standalone: true,
  imports: [CommonModule, SearchComponent, WalletTypeComponent, WalletAmountComponent, WalletAmountComponent, WalletTransactionTypeComponent, DateFilterComponent],
  template: `
      <div class="flex-wrap aic gap-x-2">
          <search (valueChanged)="service.search.next($event); service.filter()"/>
          <wallet-type (valueChanged)="service.type.next($event); service.filter()"/>
          <wallet-amount (valueChanged)="service.amountFrom.next($event.minValue); service.amountTo.next($event.maxValue); service.filter()"/>
          <wallet-transaction-type (valueChanged)="service.transactionType.next($event); service.filter()"/>
          <date-filter (valueChanged)="service.walletFrom.next($event); service.walletTo.next(''); service.filter()" [selectedValue]="service.walletFrom.value" key="from"/>
          <date-filter (valueChanged)="service.walletTo.next($event); service.filter()" [minDate]="service.walletFrom.value" [selectedValue]="service.walletTo.value" key="to"/>
      </div>
  `,
  styles: []
})
export class WalletFilterComponent {
  service = inject(WalletService)
}
