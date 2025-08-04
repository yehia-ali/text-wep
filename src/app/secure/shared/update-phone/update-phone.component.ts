import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginService } from '../../../core/services/login.service';
import {
  CountryISO,
  NgxIntlTelInputModule,
  SearchCountryField,
} from 'ngx-intl-tel-input';
import { TranslateModule } from '@ngx-translate/core';
import { InputErrorComponent } from '../../../core/inputs/input-error.component';
import { InputLabelComponent } from '../../../core/inputs/input-label.component';
import { Router, RouterLink } from '@angular/router';
import { SubmitButtonComponent } from '../../../core/components/submit-button.component';
import { MatButtonModule } from '@angular/material/button';
import { AlertService } from 'src/app/core/services/alert.service';
import { RegisterSharedDataService } from 'src/app/core/services/register-shared-data.service';
import { CodeInputModule } from 'angular-code-input';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-update-phone',
  standalone: true,
  imports: [
    CommonModule,
    CodeInputModule,
    NgxIntlTelInputModule,
    TranslateModule,
    InputLabelComponent,
    SubmitButtonComponent,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './update-phone.component.html',
  styleUrls: ['./update-phone.component.scss'],
})
export class UpdatePhoneComponent {
  next() {
    this.service.verifyEzPhone(this.phone.e164Number.replace('+', '00')).subscribe((res:any)=>{
      if(res.success){
        this.otpMode = true;
        this.alert.showAlert('sent_otp_success');
      }
    })
  }
  phoneValidators() {
    this.phoneValidator = false;
  }

  phoneValidator = false;
  service = inject(LoginService);
  loading = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  phone: any;
  otp: any;
  otpMode = false;
  constructor(
    private recaptchaV3Service: ReCaptchaV3Service,
    private alert: AlertService,
    private router: Router,
    private dialogRef : MatDialogRef<UpdatePhoneComponent>,
  ) {}


  submit(code:any) {
    this.recaptchaV3Service
      .execute('importantAction')
      .subscribe((token: string) => {
        if (token) {
          this.service.verifyEzOtp(code).subscribe((res:any)=>{
            if(res.success){
              this.alert.showAlert('update_phone_success');
              this.router.navigate(['/']);

              this.dialogRef.close();
              window.location.reload();
            }else{
              this.alert.showAlert('invalid_otp' , 'bg-danger');
            }
          })

        }
      });
  }

}
