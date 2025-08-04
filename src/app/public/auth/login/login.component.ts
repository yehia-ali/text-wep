import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthLayoutComponent} from "../auth-layout.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoginService} from "../../../core/services/login.service";
import {CountryISO, NgxIntlTelInputModule, SearchCountryField,} from 'ngx-intl-tel-input';
import {TranslateModule} from "@ngx-translate/core";
import {InputErrorComponent} from "../../../core/inputs/input-error.component";
import {InputLabelComponent} from "../../../core/inputs/input-label.component";
import {InputPasswordComponent} from "../../../core/inputs/input-password.component";
import {Router, RouterLink} from "@angular/router";
import {SubmitButtonComponent} from "../../../core/components/submit-button.component";
import {MatButtonModule} from "@angular/material/button";
import { AlertService } from 'src/app/core/services/alert.service';
import { RegisterSharedDataService } from 'src/app/core/services/register-shared-data.service';
import { CodeInputModule } from 'angular-code-input';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'login',
  standalone: true,
  imports: [CommonModule,CodeInputModule, AuthLayoutComponent, NgxIntlTelInputModule, ReactiveFormsModule, TranslateModule, InputErrorComponent, InputLabelComponent, InputPasswordComponent, RouterLink, SubmitButtonComponent, MatButtonModule , FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  disabelEditBtn = true;
  phoneValidators() {
    // if(!this.form.value.phone){
      this.phoneValidator = false
    // }
  }
  phoneValidator = false
  service = inject(LoginService);
  form!: FormGroup |any;
  loading = false;
  passwordType: string = 'password';
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  loginData:any
  loginPhone:any;
  phone:any;
  email:any;
  emailMode = true;
  verificationSuccessful = false;
  otpMode = false;
  otp: any;
  recaptchaVerified = false;
  constructor(  private recaptchaV3Service: ReCaptchaV3Service ,private fb: FormBuilder , private alert : AlertService , private router:Router,private dataService: RegisterSharedDataService  ) {
    this.form = this.fb.group({
      email:['' ,[Validators.email]],
      phone:['',Validators.minLength(9)],
      otp:[''],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });


  }
  ngOnInit() {
    this.phone = null
    this.email = null
    this.otp = null

    // this.form.valueChanges.subscribe(() => {
    //   this.executeRecaptcha();
    // });

  }

  executeRecaptcha() {
    this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
      if (token) {
        this.recaptchaVerified = true;
      } else {
        this.recaptchaVerified = false;
      }
    });
  }

  check(event:any) {
    this.loading = true
    this.service.verifyOtp(event).subscribe((res:any) => {
      this.loading = false
      if(res.success == false){
        this.alert.showAlert("pattern_error",'bg-danger')
        }else{
          this.navigateToRegister();
      }
    })
  }

  sentAnotherCode(){
    this.next()
  }

  next() {
    this.loading = true;
    this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
      if(token){
        if (this.emailMode) {
          this.form.get('email').markAsTouched();
          // Check if email is valid
          if(this.form.value.email == null){
            this.loading = false;
            this.alert.showAlert('enter_email', 'bg-danger');
            return;
          } else if (!this.form.get('email')?.valid) {
            this.loading = false;
            return;
          } else {
            this.phone = null;
            const data = { Email: this.form.value.email };
            this.verifyAccount(data);
          }
        } else {
          // Check if phone is valid
          if (!this.form.value.phone){
            this.form.get('phone').markAsTouched();
            this.phoneValidator = true
            this.loading = false;
            this.alert.showAlert('enter_phone_number', 'bg-danger');
            return;

          } else  if (!this.form.get('phone')?.valid) {
            this.loading = false;
            this.phoneValidator = false
            return;
          } else {
            this.email = null;
            this.phone = this.form.value.phone.e164Number.replace('+', '00');
            const data = { phoneNumber: this.phone };
            this.verifyAccount(data);
            this.phoneValidator = false
          }
        }
      }
    })
  }


  verifyAccount(data: any) {
    this.service.verifyAccount(data).subscribe((res: any) => {
      this.loading = false;
      this.disabelEditBtn = true;
        setTimeout(() => {
          this.disabelEditBtn = false;
        }, 5000);

      if (res.data.state) {
        this.loginPhone = res.data.userName;
        this.loginData = null;
        this.verificationSuccessful = true;
      } else {
        this.otpMode = true;
        if(this.emailMode){
          this.alert.showAlert("sent_otp_success_email", 'bg-success' , 5000);
        }else{
          this.alert.showAlert("sent_otp_success_sms", 'bg-success' , 5000);
        }
        this.loginData = this.form.value.email || this.form.value.phone.e164Number.replace('+', '00');
      }
    },(error:any) => {
      this.alert.showAlert('not_allowed_login' , 'bg-danger')
      this.loading = false
    })
  }


  emailModeSwitch(){
    this.emailMode = !this.emailMode;
    this.form.reset()
  }

  submit() {
    this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
      if(token){
        if (this.form.value.password) {
          this.loading = true;
          let data = {
            password: this.form.value.password,
            phoneNumber: this.loginPhone,
          };
          this.service.login(data).subscribe((res) => {
            this.loading = false;

          })
        } else {
          this.loading = false;
        }
      }
    })
  }

  get f() {
    return this.form.controls;
  }

  navigateToRegister() {
    if(this.emailMode){
      const email = this.form.value.email;
      this.dataService.setEmail(email);
      }else{
        const phone = this.form.value.phone.e164Number.replace('+', '00');
        this.dataService.setPhone(phone);
    }

    this.router.navigate(['/auth/register']);
  }

}
