import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../core/services/alert.service";
import {RegisterService} from "../../core/services/register.service";

declare const window: any;

@Component({
  selector: 'redirect',
  standalone: true,
  imports: [CommonModule],
  template: `

  `,
  styles: []
})
export class RedirectComponent implements OnInit, OnDestroy {
  sub!: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private authSer: RegisterService, private alert: AlertService) {
  }

  ngOnInit(): void {
    this.sub = this.authSer.firstLogin.subscribe((res: any) => {
      if (res) {
        this.router.navigate(['/auth/registration-completed']);
      } else {
        this.route.queryParamMap.subscribe((params: any) => {
          if (params.get('success')) {
            if (params.get('success').toLowerCase() == 'true') {
              this.authSer.purchaseSuccess.next(true);
              sessionStorage.removeItem('paymentUrl');
              window.webkit?.messageHandlers.MessageHandler.postMessage("success");
              this.router.navigate(['/auth/purchase-successful']).then(() => {
                this.alert.showAlert('payment_success')
              });
            } else {
              this.authSer.purchaseSuccess.next(false)
              window.webkit?.messageHandlers.MessageHandler.postMessage("error");
              this.router.navigate(['/auth/purchase-failed']);
            }
          }
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
