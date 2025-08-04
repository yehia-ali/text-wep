import {environment} from "../../../environments/environment";
import {SubscriptionService} from "../services/subscription.service";

export abstract class Payment {
  protected constructor(public subscriptionSer: SubscriptionService) {
  }

  goToPay(paymentSubscriptionStatus: any, paymentOrderId: any) {
    this.subscriptionSer.orderKey(paymentOrderId).subscribe((_res: any) => {
      let token = _res.data.token;
      let url = `https://accept.paymob.com/api/acceptance/iframes/${environment.iframeId}?payment_token=${token}`;
      localStorage.setItem('p-token', paymentOrderId);
      sessionStorage.setItem('paymentUrl', url);
      window.open(`${url}`, '_self');
      return _res;
    });
  }
}
