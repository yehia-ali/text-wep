import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Country} from "../../../../core/interfaces/user-profile";
import {environment} from "../../../../../environments/environment";
import {UserService} from "../../../../core/services/user.service";
import {AlertService} from "../../../../core/services/alert.service";
import {ArabicNumbersPipe} from "../../../../core/pipes/arabic-numbers.pipe";
import {TranslateService} from "@ngx-translate/core";
import {CompanyService} from 'src/app/core/services/company.service';
import {CountriesService} from "../../../../core/services/countries.service";
import {UploadImageModule} from "../../../../core/components/upload-image/upload-image.module";
import {MagicScrollDirective} from "../../../../core/directives/magic-scroll.directive";
import {InputLabelComponent} from "../../../../core/inputs/input-label.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {InputErrorComponent} from "../../../../core/inputs/input-error.component";
import {SubmitButtonComponent} from "../../../../core/components/submit-button.component";
import {LayoutComponent} from "../../../../core/components/layout.component";
import {RolesService} from "../../../../core/services/roles.service";

@Component({
  selector: 'profile',
  standalone: true,
  imports: [CommonModule, UploadImageModule, MagicScrollDirective, ReactiveFormsModule, InputLabelComponent, NgSelectModule, InputErrorComponent, SubmitButtonComponent, LayoutComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  company: any;
  isAdmin = false;
  form: FormGroup;
  loading = false;
  lang = localStorage.getItem('language') || 'en';
  countries: Country[] = [];
  industries = [];
  api = environment.apiUrl;
  employees = [
    {
      value: 1,
      text: this.arabicNumbers.transform(1) + '-' + this.arabicNumbers.transform(10) + ' ' + this.translate.instant('employee')
    },
    {
      value: 2,
      text: this.arabicNumbers.transform(11) + '-' + this.arabicNumbers.transform(200) + ' ' + this.translate.instant('employee')
    },
    {
      value: 3,
      text: this.arabicNumbers.transform(201) + '-' + this.arabicNumbers.transform(500) + ' ' + this.translate.instant('employee')
    },
    {
      value: 4,
      text: this.arabicNumbers.transform(501) + '-' + this.arabicNumbers.transform(1000) + ' ' + this.translate.instant('employee')
    },
    {value: 5, text: this.arabicNumbers.transform(1000) + '+' + ' ' + this.translate.instant('employee')},
  ]


  constructor(private service: CompanyService, private rolesSer: RolesService, private alertSer: AlertService, private fb: FormBuilder, private countrySer: CountriesService, private arabicNumbers: ArabicNumbersPipe, private translate: TranslateService) {
    this.form = this.fb.group({
      name: ["", Validators.required],
      countryId: [null, Validators.required],
      hrEmail: ["", Validators.required],
      numberOfEmployees: [null, Validators.required],
    })
  }

  ngOnInit(): void {
    this.rolesSer.canAccessAdmin.subscribe(res => {
      this.isAdmin = res;
      if (!this.isAdmin) {
        this.f['name'].disable();
        this.f['hrEmail'].disable();
      }
    })
    this.service.companyProfile.subscribe((res: any) => {
      this.company = res;
      if (res.id) {
        this.form.patchValue({
          name: res.name,
          hrEmail: res.hrEmail,
          numberOfEmployees: res.numberOfEmployees,
          countryId: res.country.id,
        });
      }
    })
    this.service.getCompanyProfile().subscribe()
    this.countrySer.getCountries().subscribe((res: any) => this.countries = res);
    this.service.getIndustries().subscribe((res: any) => this.industries = res.data.items);
  }

  updateImage($event: any) {
    this.alertSer.showAlert('file_uploading', 'bg-primary', 5000000);
    let formData = new FormData();
    formData.append("uploadedFile", $event);
    this.service.updateImage(formData).subscribe((res: any) => {
      if (res.success) {
        this.alertSer.showAlert('profile_updated');
        this.service.getCompanyProfile().subscribe()
      }
    })
  }

  submit() {
    this.loading = true;
    this.service.updateProfile(this.form.value).subscribe((res: any) => {
      if (res.success) {
        this.alertSer.showAlert('profile_updated');
      }
      this.loading = false;
    })
  }

  get f() {
    return this.form.controls
  }

}
