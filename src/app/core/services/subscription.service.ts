import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  paymentStatus: any = new BehaviorSubject<any>(null)
  details: any = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
  }

  orderKey(orderId: number) {
    return this.http.post(
      `${environment.coreBase}/api/PaymentOrder/OrderPayment`,
      {orderId, paymentGateWay: 1}
    );
  }

  getSubscriptionDetails() {
    return this.http.get(`${environment.apiUrl}api/PaymentOrder/GetMySubscriptionDetails`).pipe(map((res: any) => {
      this.details.next(res.data);
      return res.data;
    }));
  }

  billingHistory() {
    let url = new URL(`${environment.apiUrl}api/PaymentOrder/GetMySpaceBillingHistory`)
    if (typeof (this.paymentStatus.value) == 'number') {
      url.searchParams.append('PaymentStatus', this.paymentStatus.value)
    }
    return this.http.get(`${url}`).pipe(map((res: any) => res.data.items));
  }

  getUnpaidOrders() {
    return this.http.post(`${environment.apiUrl}api/PaymentOrder/GetMySubscriptionUnpaidOrders`, {}).pipe(map((res: any) => res.data));
  }

  getOrderDetails(id: number) {
    return this.http.get(`${environment.apiUrl}api/PaymentOrder/GetMyBillingOrder?id=${id}`).pipe(map((res: any) => res.data));
  }
}
