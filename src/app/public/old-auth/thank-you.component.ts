import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegisterService} from "../../core/services/register.service";
import {Title} from "@angular/platform-browser";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {callMobileFunction} from "../../core/functions/mobile-handle";
import {DialogMessageComponent} from './dialog-message.component';

@Component({
  selector: 'thank-you',
  standalone: true,
  imports: [CommonModule],
  template: ``,
  styles: []
})
export class ThankYouComponent implements OnInit {

  constructor(private service: RegisterService, private title: Title, private dialog: MatDialog, private snackbar: MatSnackBar, private router: Router) {
  }

  ngOnInit(): void {
    this.snackbar.dismiss()
    // this.service.purchaseSuccess.next(false)
    // this.service.firstLoginData.next({password: 25})
    this.service.firstLoginData.subscribe((res: any) => {
      if (!!res.password) {
        this.title.setTitle('Thank you .. Registration completed')
        let ref = this.dialog.open(DialogMessageComponent, {
          panelClass: 'dialog-message',
          data: {
            type: 'success',
            message: 'new_login_message',
            btn_message: 'new_login_btn'
          }
        });
        ref.afterClosed().subscribe(() => {
          localStorage.removeItem('p-token');
          sessionStorage.removeItem('paymentUrl');
          callMobileFunction();
          this.dialog.closeAll();
          this.router.navigate(['/']);
        })
      } else {
        this.service.purchaseSuccess.subscribe(res => {
          let type;
          let message;
          if (res) {
            this.title.setTitle('Thank you .. Purchase successful');
            localStorage.removeItem('p-token');
            sessionStorage.removeItem('paymentUrl');
            type = 'success';
            message = 'payment_success';
          } else {
            this.title.setTitle('Sorry .. Purchase failed');
            type = 'error';
            message = 'payment_error';
          }
          let ref = this.dialog.open(DialogMessageComponent, {
            panelClass: 'dialog-message',
            disableClose: true,
            data: {
              type,
              message
            }
          });
          ref.backdropClick().subscribe(() => {
            callMobileFunction();
            localStorage.removeItem('p-token');
            sessionStorage.removeItem('paymentUrl');
            this.dialog.closeAll();
            this.router.navigate(['/']);
          })
        })
      }
    })
  }
}
