import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {PaymentMessageComponent} from '../payment-message/payment-message.component';
declare const window: any;

@Component({
  selector: 'after-payment',
  standalone: true,
  imports: [CommonModule],
  template: `

  `,
  styles: []
})
export class AfterPaymentComponent implements OnInit {

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
    let params = new URLSearchParams(window.location.search);
    let paymentSuccess = params.get('success')?.toLowerCase() == 'true';
    if (paymentSuccess) {
      window.webkit?.messageHandlers.MessageHandler.postMessage("success");
    } else {
      window.webkit?.messageHandlers.MessageHandler.postMessage("error");
    }
    this.dialog.open(PaymentMessageComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      data: {
        type: paymentSuccess ? 'success' : 'error',
      }
    })
  }

}
