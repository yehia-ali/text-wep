import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {inject, Injectable} from "@angular/core";

import {Observable, tap} from "rxjs";
import {AlertService} from "../services/alert.service";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {PaymentRequiredComponent} from "../components/payment-required/payment-required.component";

// import { PaymentRequiredComponent } from "../components/payment-required/payment-required.component";


@Injectable()
export class GlobalInterceptor implements HttpInterceptor {
  language = localStorage.getItem('language') || 'en';
  firebaseToken = localStorage.getItem('firebase-token')
  dialog = inject(MatDialog);

  constructor(private alert: AlertService, private translate: TranslateService, private router: Router) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = localStorage.getItem('token');
    let requestToken = req.headers.getAll('Authorization');
    let sendToken: any = (requestToken && requestToken!.length > 0) ? requestToken![0] : token;
    let spaceId;
    if (req.url.includes('publicspace')) {
      spaceId = '90817'
    } else {
      spaceId = req.headers.get('space-id') || localStorage.getItem('space-id') || ''
    }
    if (token) {
      authReq = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + sendToken).set('SpaceId', spaceId).set('Language', this.language).set('FireBaseToken', this.firebaseToken || '').set('DeviceType', '3')
      });
    } else {
      authReq = req.clone({
        headers: req.headers.set('Language', this.language)
      });
    }
    return next.handle(authReq).pipe(
      tap(event => {
          if (event instanceof HttpResponse) {

            if (event.url?.includes('api')) {
              if (!event.body.success) {
                if (event.body.code != 9954) {
                  this.alert.showAlert(event.body.message, 'bg-danger');
                }
                if (event.body.code == 9954) {
                  // localStorage.setItem('welcome', 'true');
                  if (!window.location.href.includes('welcome') && !window.location.href.includes('auth/login')) {
                    let ref = this.dialog.open(PaymentRequiredComponent, {
                      disableClose: true,
                      panelClass: 'small-dialog'
                    })
                    ref.afterClosed().subscribe(() => {
                      window.location.href = '/welcome';
                    })
                  }
                } else if (event.body.code == 401 || event.body.code == 205) {
                  localStorage.clear();
                  localStorage.setItem('language' , 'ar');
                  window.location.reload()
                }
              }
            }
          }
        },
        error => {
          if (error.status == 401) {
            this.alert.showAlert(this.translate.instant('not_authorized'), 'bg-danger');
            let lang = localStorage.getItem('language') || 'en';
            localStorage.clear();
            localStorage.setItem('language', lang);
            this.router.navigate(['/auth/login']);
          } else if (error.status == 403) {
            this.alert.showAlert(this.translate.instant('not_authorized'), 'bg-danger');
          }
        }
      )
    );
  }
}
