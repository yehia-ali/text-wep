import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {UserImageComponent} from "./user-image.component";
import {ArabicNumbersPipe} from "../pipes/arabic-numbers.pipe";
import { Wallet } from '../interfaces/wallet';
import { ConfirmWalletPasswordComponent } from './confirm-wallet-password/confirm-wallet-password.component';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'confirm-payment',
  standalone: true,
  imports: [TranslateModule, MatButtonModule, MatDialogModule, ArabicNumbersPipe, UserImageComponent],
  template: `
      <div class="confirm-transfer" dir="auto">
          <h3>{{'transfer_details' | translate}}</h3>

          <div class="confirm-data">
              <div mat-dialog-content class="mt-1 mx-auto">
                  <div class="amount flex-column-center py-1 border-primary primary rounded">
                      <p>{{'total_amount' | translate}}</p>
                      <h2 class="fs-36 mt-2 money-amount">
                          <div class="pb-2 flex aic gap-x-1">
                              <span>{{data.amount | arabicNumbers}}</span>
                              <span>{{'egp' | translate}}</span>
                          </div>
                      </h2>
                  </div>
                  <div class="img text-center my-3">
                      <img src="assets/images/icons/arrows-down.svg" alt="arrows down">
                  </div>

                  <div class="box border-bottom border-right border-left rounded p-2 w-100 mt-2">
                      <p class="mb-1 inline-block">{{'to' | translate}}</p>
                      <div class="flex aic gap-x-1">
                          <user-image [imageUrl]="environment.publicImageUrl" [img]="data.wallet.imageUrl"/>
                          <div class="info">
                              <p>{{data.wallet.name}}</p>
                              <p class="mt-25">{{data.wallet.phoneNumber}}</p>
                          </div>
                      </div>
                  </div>
              </div>
              <div mat-dialog-actions class="mx-auto">
                  <button mat-raised-button color="primary" class="w-100 bold" (click)="SendMoney()">{{'transfer' | translate}}</button>
              </div>
          </div>
      </div>
  `,
  styles: [`
    .confirm-data {
      max-width: 500px;
      margin: auto;

      .box {
        box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04);
      }
    }
  `]
})
export class ConfirmTransferComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { amount: number, wallet: Wallet }, private dialog: MatDialog) {
  }


  SendMoney() {
    let data = {
      walletId: this.data.wallet.id,
      amount: this.data.amount
    }
    this.dialog.open(ConfirmWalletPasswordComponent, {
      width: '500px',
      data: {
        type: 'confirm_transfer',
        data
      }
    })
  }

  protected readonly environment = environment;
}



