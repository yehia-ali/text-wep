import {Component, inject, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {Router} from '@angular/router';
import {callMobileFunction} from "../../functions/mobile-handle";

declare const window: any;

@Component({
  selector: 'payment-message',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatButtonModule, MatDialogModule],
  template: `
    <div class="dialog-message w-100 p-3">
      <div class="flex-center w-100">
        <div class="bg-primary white rounded-50 message-type flex-center" *ngIf="data.type == 'success'">
          <i class='bx bx-check fs-50'></i>
        </div>
        <div class="bg-danger white rounded-50 message-type flex-center" *ngIf="data.type == 'error'">
          <i class='bx bx-x fs-50'></i>
        </div>
      </div>
      <p class="fs-35 mt-75 text-center" [ngClass]="{'primary': data.type == 'success', 'danger': data.type == 'error'}">
        {{ data.type | translate }}
      </p>
      <p class="fs-18 text-center px-1">{{ data.type == 'success' ? ('payment_success' | translate) : ('payment_failed' | translate) }}</p>
      <div mat-dialog-actions class="pb-0">
        <div class="flex-center gap-x-1 w-100 mt-2">
          <button mat-raised-button class="flex-50" [ngClass]="{'bg-gray': data.type == 'error', 'bg-primary white': data.type == 'success'}" (click)="okay()">
            {{ 'okay' | translate }}
          </button>
          <button mat-raised-button class="flex-50 bg-danger" *ngIf="data.type == 'error'" (click)="back()">{{ 'try_again' | translate }}</button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PaymentMessageComponent {
  url: any = sessionStorage.getItem('paymentUrl');

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private dialog: MatDialog) {

  }

  okay() {
    let token = localStorage.getItem('token');
    sessionStorage.removeItem('paymentUrl');
    localStorage.removeItem('p-token');
    if (this.router.url?.includes('redirection')) {
      window.webkit?.messageHandlers.MessageHandler.postMessage("success");
      window.Android?.useConsultation(true);
      this.router.navigate(['/wallet']);
      this.dialog.closeAll();
      return
    } else {
      callMobileFunction();
    }

    if (token) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/auth/login']);
    }
    this.dialog.closeAll();
  }

  back() {
    window.open(this.url, '_self');
  }
}
