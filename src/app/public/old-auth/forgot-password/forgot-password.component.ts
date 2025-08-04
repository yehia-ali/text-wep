import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthLayoutComponent} from "../auth-layout.component";
import {TranslateModule} from "@ngx-translate/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputLabelComponent} from "../../../core/inputs/input-label.component";
import {InputErrorComponent} from "../../../core/inputs/input-error.component";
import {SubmitButtonComponent} from "../../../core/components/submit-button.component";
import {MatButtonModule} from "@angular/material/button";
import {CountryISO, NgxIntlTelInputModule, SearchCountryField} from "ngx-intl-tel-input";
import {Router} from "@angular/router";
import {callMobileFunction} from "../../../core/functions/mobile-handle";
import {ForgotPasswordService} from "../../../core/services/forgot-password.service";

@Component({
  selector: 'forgot-password',
  standalone: true,
  imports: [CommonModule, AuthLayoutComponent, TranslateModule, ReactiveFormsModule, InputLabelComponent, InputErrorComponent, SubmitButtonComponent, MatButtonModule, NgxIntlTelInputModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  form: FormGroup;
  loading: boolean = false;
  SearchCountryField = SearchCountryField;
  countryISO = CountryISO;

  constructor(
    private fb: FormBuilder,
    private service: ForgotPasswordService,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        phone: ["", Validators.required],
      }
    );
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {

  }

  submit() {
    this.loading = true;
    if (this.form.valid) {
      let data = {
        phoneNumber: this.form.value.phone.e164Number.replace('+', '00'),
      };
      this.service.phoneNumber(data).subscribe((res: any) => {
        if (res.success) {
          this.service.phone.next(data.phoneNumber);
          this.router.navigate(['/auth/verify-phone']);
        }
        this.loading = false;
      });
    }
  }

  toLogin() {
    callMobileFunction()
    this.router.navigate(['/auth/login']);
  }

  protected readonly CountryISO = CountryISO;
}
