import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthLayoutComponent} from "../auth-layout.component";
import {TranslateModule} from "@ngx-translate/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputLabelComponent} from "../../../core/inputs/input-label.component";
import {InputPasswordComponent} from "../../../core/inputs/input-password.component";
import {InputErrorComponent} from "../../../core/inputs/input-error.component";
import {SubmitButtonComponent} from "../../../core/components/submit-button.component";
import {MatButtonModule} from "@angular/material/button";
import {Router} from "@angular/router";
import {AlertService} from "../../../core/services/alert.service";
import {ForgotPasswordService} from "../../../core/services/forgot-password.service";
import {callMobileFunction} from "../../../core/functions/mobile-handle";
import {PasswordsMatch} from "../../../core/validators/passwords-match";

@Component({
  selector: 'reset-password',
  standalone: true,
  imports: [CommonModule, AuthLayoutComponent, TranslateModule, ReactiveFormsModule, InputLabelComponent, InputPasswordComponent, InputErrorComponent, SubmitButtonComponent, MatButtonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  loading = false;
  passwordType: string = 'password';
  confirmPasswordType: string = 'password';

  constructor(
    private fb: FormBuilder,
    private service: ForgotPasswordService,
    private router: Router,
    private alert: AlertService
  ) {
    this.form = this.fb.group({
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required]],
      },
      {validator: PasswordsMatch})
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.service.token.subscribe(res => {
      if (!res) {
        this.router.navigate(["/auth/login"]);
      }
    })
  }

  submit() {
    this.loading = true;
    if (this.form.valid) {
      this.service.resetPassword(this.form.value.password).subscribe((res: any) => {
        if (res.success) {
          this.service.code.next('');
          this.service.phone.next('');
          this.service.token.next('');
          this.alert.showAlert('password_changed', 'bg-success');
          this.toLogin()
        }
        this.loading = false;
      })
    }
  }

  toLogin() {
    callMobileFunction()
    this.router.navigate(['/auth/login']);
  }

}
