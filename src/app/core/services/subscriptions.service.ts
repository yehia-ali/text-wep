import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {
  paymentStatus = new BehaviorSubject(null)
  details = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
  }
  orderKey(id: number,PaymentGateWay:any) {
    let PostData = {
      orderId:id,
      PaymentGateWay:PaymentGateWay
    }
    return this.http.post(
      `${environment.coreBase}/api/PaymentOrder/OrderPayment`,
      PostData
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
    if (typeof(this.paymentStatus.value) == 'number') {
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
