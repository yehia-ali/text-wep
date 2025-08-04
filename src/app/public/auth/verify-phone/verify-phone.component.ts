import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthLayoutComponent} from "../auth-layout.component";
import {TranslateModule} from "@ngx-translate/core";
import {CodeInputModule} from "angular-code-input";
import {Router} from "@angular/router";
import {ForgotPasswordService} from "../../../core/services/forgot-password.service";
import {callMobileFunction} from "../../../core/functions/mobile-handle";

@Component({
  selector: 'verify-phone',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, AuthLayoutComponent, TranslateModule, CodeInputModule],
  templateUrl: './verify-phone.component.html',
  styleUrls: ['./verify-phone.component.scss']
})
export class VerifyPhoneComponent implements OnInit {
  phone: any;

  constructor(
    private service: ForgotPasswordService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.service.phone.subscribe(res => {
      if (res) {
        this.phone = res
      } else {
        this.router.navigate(["/auth/login"]);
      }
    });
  }

  submit($event: any) {
    this.service.verifyPhone($event).subscribe((res: any) => {
      if (res.success) {
        this.service.code.next($event);
        this.service.token.next(res.data.resetPasswordToken);
        this.router.navigate(["/auth/reset-password"]);
      }
    });
  }

  toLogin() {
    callMobileFunction()
    this.router.navigate(['/auth/login']);
  }
}
