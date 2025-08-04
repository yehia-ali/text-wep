import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {TopUpComponent} from '../top-up.component';
import {TransferComponent} from '../transfer.component';
import {WalletService} from "../../services/wallet.service";
import {map, switchMap} from "rxjs";
import {ArabicNumbersPipe} from "../../pipes/arabic-numbers.pipe";

@Component({
  selector: 'user-balance',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatButtonModule, ArabicNumbersPipe],
  template: `
    <div class="user-balance flex aic jcsb rounded px-4 py-1">
      <div class="balance white">
        <p class="fs-24">{{'your_balance' | translate}}</p>
        <p class="fs-32  bold">{{balance$ | async | arabicNumbers}} {{'egp' | translate}}</p>
      </div>
      <div class="flex aic gap-x-3">
        <button class="bg-white clickable-btn py-1 px-2 rounded-3" (click)="addFund()">
          <div class="img">
            <img src="assets/images/wallet/top-up.svg" alt="plus image">
          </div>
          <p class="mt-1">{{'top-up' | translate}}</p>
        </button>
        <button class="bg-white clickable-btn py-1 px-2 rounded-3" (click)="SendMoney()">
          <div class="img">
            <img src="assets/images/wallet/transfer.svg" alt="plus image">
          </div>
          <p class="mt-1">{{'transfer' | translate}}</p>
        </button>
        <button class="bg-white clickable-btn py-1 px-2 rounded-3">
          <div class="img">
            <img src="assets/images/wallet/request.svg" alt="plus image">
          </div>
          <p class="mt-1">{{'request' | translate}}</p>
        </button>
        <button class="bg-white clickable-btn py-1 px-2 rounded-3">
          <div class="img">
            <img src="assets/images/wallet/payment.svg" alt="plus image">
          </div>
          <p class="mt-1">{{'payment' | translate}}</p>
        </button>
      </div>
      <div class="img">
        <img src="assets/images/icons/balance.svg" alt="balance image">
      </div>
    </div>
  `,
  styles: [`
    .user-balance {
      height: 17.2rem;
      background: linear-gradient(135deg, rgba(123, 85, 211, 0.60) 0%, rgba(123, 85, 211, 0.70) 62.43%, #7B55D3 100%);
    }

    .add-balance {
      width: 280px;
      height: 56px;

      .icon {
        width: 3rem;
        height: 3rem;
      }
    }
  `]
})
export class UserBalanceComponent {
  balance$ = this.service.balanceChanged.pipe(switchMap(_ => this.service.getBalance().pipe(map((res: any) => res.data))));

  constructor(private dialog: MatDialog, private service: WalletService) {
  }

  addFund() {
    this.dialog.open(TopUpComponent, {
      width: '500px',
    });
  }

  SendMoney() {
    this.dialog.open(TransferComponent, {
      width: '500px',
    });
  }
}
