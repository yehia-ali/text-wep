import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthLayoutComponent} from "../auth-layout.component";
import {MagicScrollDirective} from "../../../core/directives/magic-scroll.directive";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoginService} from "../../../core/services/login.service";
import {CountryISO, NgxIntlTelInputModule, SearchCountryField,} from 'ngx-intl-tel-input';
import {TranslateModule} from "@ngx-translate/core";
import {InputErrorComponent} from "../../../core/inputs/input-error.component";
import {InputLabelComponent} from "../../../core/inputs/input-label.component";
import {InputPasswordComponent} from "../../../core/inputs/input-password.component";
import {RouterLink} from "@angular/router";
import {SubmitButtonComponent} from "../../../core/components/submit-button.component";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'login',
  standalone: true,
  imports: [CommonModule, AuthLayoutComponent, MagicScrollDirective, NgxIntlTelInputModule, ReactiveFormsModule, TranslateModule, InputErrorComponent, InputLabelComponent, InputPasswordComponent, RouterLink, SubmitButtonComponent, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  service = inject(LoginService);
  form!: FormGroup;
  loading = false;
  passwordType: string = 'password';
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      phone: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    if (this.form.valid) {
      this.loading = true;
      let data = {
        password: this.form.value.password,
        phoneNumber: this.form.value.phone.e164Number.replace('+', '00'),
      };
      this.service.login(data).subscribe(() => {
        this.loading = false;
      })
    } else {
      this.form.markAllAsTouched();
    }
  }

  get f() {
    return this.form.controls;
  }
}
