import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LanguageComponent} from "../../../core/components/language.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CountryISO, NgxIntlTelInputModule, SearchCountryField} from 'ngx-intl-tel-input';
import {Subscription} from "rxjs";
import {Package} from 'src/app/core/interfaces/package';
import {RegisterService} from "../../../core/services/register.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PackagesService} from "../../../core/services/packages.service";
import {TranslateModule} from "@ngx-translate/core";
import {InputLabelComponent} from "../../../core/inputs/input-label.component";
import {InputErrorComponent} from "../../../core/inputs/input-error.component";
import {MatRadioModule} from "@angular/material/radio";
import {ArabicNumbersPipe} from "../../../core/pipes/arabic-numbers.pipe";
import {SubmitButtonComponent} from "../../../core/components/submit-button.component";
import {MatButtonModule} from "@angular/material/button";
import {callMobileFunction} from "../../../core/functions/mobile-handle";
import {GetCountryId} from "../../../core/functions/get-country-id";
import {LogoComponent} from "../../../core/components/logo.component";
import {InputPasswordComponent} from "../../../core/inputs/input-password.component";
import {ReCaptchaV3Service} from "ng-recaptcha";

@Component({
  selector: 'register',
  standalone: true,
  imports: [CommonModule, LanguageComponent, ReactiveFormsModule, TranslateModule, InputLabelComponent, InputErrorComponent, NgxIntlTelInputModule, MatRadioModule, FormsModule, ArabicNumbersPipe, SubmitButtonComponent, MatButtonModule, LogoComponent, InputPasswordComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  loading = false;
  passwordType = 'password';
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  source$!: Subscription;
  packages!: Package[];
  createSpace = false;

  selectedId!: number;
  total = 0;
  price = 0;
  numberOfEmployees: number = 0;
  live = 1;
  mobile = false;


  constructor(
    private fb: FormBuilder,
    private service: RegisterService,
    private packagesSer: PackagesService,
    private activatedRoute: ActivatedRoute,
    private recaptchaV3Service: ReCaptchaV3Service,
    private router: Router
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,64}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      spaceName: ['', Validators.required],
      managerCode: ['', Validators.required],
    });
  }


  ngOnInit(): void {
    this.service.appConfig().subscribe((res: any) => {
      this.live = res.data.isReviewing
    });
    this.packagesSer.getPackages().subscribe((res: any) => {
      this.packages = res;
      this.selectedId = this.packages[0].id;
      this.numberOfEmployees = this.packages[0].limitedNumberOfUser;
      this.source$ = this.activatedRoute.queryParams.subscribe((res) => {
        if (res['packageId']) {
          this.form.controls['managerCode'].clearValidators();
          this.form.controls['managerCode'].updateValueAndValidity();
          this.packages.map((item) => {
            if (item.id == res['packageId']) {
              if (item.limitedNumberOfUser) {
                this.numberOfEmployees = item.limitedNumberOfUser;
              } else {
                this.numberOfEmployees = 1;
              }
              this.price = item.pricePerUser;
              this.total = this.price * this.numberOfEmployees;
              this.selectedId = item.id;
            }
          });
          this.createSpace = true;
        } else {
          this.form.controls['spaceName'].clearValidators();
          this.form.controls['spaceName'].updateValueAndValidity();
        }
      });
    });
    this.checkMobile();
  }

  selectPackage(item: Package) {
    this.selectedId = item.id;
    if (!item.limitedNumberOfUser) {
      this.price = item.pricePerUser;
      if (this.numberOfEmployees < 11) {
        this.numberOfEmployees = 11;
      }
    } else {
      this.total = 0;
      this.price = 0;
      this.numberOfEmployees = item.limitedNumberOfUser;
    }
    this.total = this.numberOfEmployees * this.price;

  }

  registerType() {
    if (!this.createSpace) {
      this.form.controls['managerCode'].clearValidators();
      this.form.controls['managerCode'].updateValueAndValidity();
      this.form.controls['spaceName'].addValidators(Validators.required);
      this.form.controls['spaceName'].updateValueAndValidity();
    } else {
      this.form.controls['spaceName'].clearValidators();
      this.form.controls['spaceName'].updateValueAndValidity();
      this.form.controls['managerCode'].addValidators(Validators.required);
      this.form.controls['managerCode'].updateValueAndValidity();
    }
  }

  submit() {
    this.loading = true;
    let countryID = GetCountryId(this.form.value.phone.countryCode)?.id;
    let data;
    this.recaptchaV3Service.execute('importantAction').subscribe((token: any) => {
      data = {
        name: this.form.value.firstName.trim() + ' ' + this.form.value.lastName.trim(),
        phoneNumber: this.form.value.phone.e164Number.replace('+', '00'),
        email: this.form.value.email,
        password: this.form.value.password,
        countryID,
        ...(!this.createSpace && {managerCode: this.form.value.managerCode}),
        ...(this.createSpace && {spaceName: this.form.value.spaceName}),
        ...(this.createSpace && {paymentPackageId: this.selectedId}),
        ...(this.createSpace && {numberOfEmployees: this.numberOfEmployees}),
      };
      if (this.form.valid) {
        if (this.createSpace) {
          this.service.mainRegister(data, token).subscribe((res) => {
            if (!res?.success) {
              this.loading = false;
            }
          });
        } else {
          this.service.mainJoinSpace(data).subscribe((res: any) => {
            if (!res?.success) {
              this.loading = false;
            }
          });
        }
      }
    });
  }


  add() {
    this.numberOfEmployees++;
    this.total = this.numberOfEmployees * this.price;
  }

  minus() {
    if (this.numberOfEmployees > 11) {
      this.numberOfEmployees--;
      this.total = this.numberOfEmployees * this.price;
    }
  }

  calc($event: any) {
    this.total = $event * this.price;
  }

  goToLogin() {
    callMobileFunction()
    this.router.navigate(['/auth/login'])
  }

  // check if the user is using mobile or not and also check resize
  @HostListener('window:resize', ['$event'])
  checkMobile() {
    this.mobile = window.innerWidth < 992;
  }

  get f() {
    return this.form.controls;
  }

  ngOnDestroy() {
    this.source$.unsubscribe();
  }
}
