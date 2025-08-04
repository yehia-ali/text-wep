import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {environment} from "../../../environments/environment";
import {LoadingComponent} from "../components/loading.component";

@Component({
  selector: 'order-payment',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  template: `
    <loading/>
  `,
  styles: []
})
export class OrderPaymentComponent implements OnInit {
// get orderPaymentToken param
  orderPaymentToken = this.route.snapshot.queryParams['orderPaymentToken'];
  lang = this.route.snapshot.queryParams['language'];

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    if (this.orderPaymentToken) {
      let url = `https://accept.paymob.com/api/acceptance/iframes/${environment.iframeId}?payment_token=${this.orderPaymentToken}`;
      localStorage.setItem('p-token', this.orderPaymentToken)
      sessionStorage.setItem('paymentUrl', url)
      setTimeout(() => {
        window.open(`${url}`, '_self');
      }, 20)

    } else {
      window.location.href = '/'
    }
  }

}
