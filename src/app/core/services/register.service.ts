import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, map} from "rxjs";
import {Router} from "@angular/router";
import {AlertService} from "./alert.service";
import {SubscriptionsService} from "./subscriptions.service";
import {callMobileFunction} from "../functions/mobile-handle";

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  phone = new BehaviorSubject<any>('');
  code = new BehaviorSubject<any>('');
  token = new BehaviorSubject<any>('');
  purchaseSuccess = new BehaviorSubject<any>(false);
  firstLogin = new BehaviorSubject(false);
  firstLoginData = new BehaviorSubject({})

  constructor(private http: HttpClient,
              private router: Router,
              private subscriptionSer: SubscriptionsService,
              private alert: AlertService) {
  }

  appConfig() {
    return this.http.post(`${environment.coreBase}/api/ApplicationConfigration/getByDeviceType`, {}, {
      headers: new HttpHeaders().set('DeviceType', '3')
    });
  }

  mainRegister(data: any, token: string) {
    return this.http
      .post(
        `${environment.coreBase}/api/Authentication/AnonymousSpaceRegister`,
        data,
        {'headers': new HttpHeaders().set('Token', token)}
      )
      .pipe(
        map((res: any) => {
          if (res?.success) {
            this.alert.showAlert('account_created')
            if (res.data.paymentSubscriptionStatus == 1) {
              this.firstLogin.next(true);
              this.firstLoginData.next(data);
              localStorage.setItem('p-token', 'first login')
              callMobileFunction()
              this.router.navigate(['/auth/redirect']);
              return res;
            } else {
              this.subscriptionSer.orderKey(res.data.paymentOrderId, this.inEgypt() ? 1 : 2).subscribe((_res: any) => {
                if (this.inEgypt()) {
                  let token = _res.data.token;
                  let paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/${environment.iframeId}?payment_token=${token}`;
                  localStorage.setItem('p-token', token);
                  sessionStorage.setItem('paymentUrl', paymentUrl)
                  setTimeout(() => {
                    window.open(`${paymentUrl}`, '_self');
                  }, 20)

                } else {
                  let paymentUrl = `${_res.data}`;
                  sessionStorage.setItem('paymentUrl', paymentUrl)
                  setTimeout(() => {
                    window.open(`${paymentUrl}`, '_self');
                  }, 20)
                }
                return _res;
              });
            }
          } else {
            return res;
          }
        })
      );
  }


  mainJoinSpace(data: any) {
    return this.http
      .post(
        `${environment.coreBase}/api/Authentication/AnonymousMainJoinSpace`,
        data
      )
      .pipe(
        map((res: any) => {
          if (res.success) {
            callMobileFunction()
            this.router.navigate(['/auth/login']);
            this.alert.showAlert('joined_space')
          } else {
            return res;
          }
        })
      );
  }

  inEgypt() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase().includes("africa/cairo");
  }
}
