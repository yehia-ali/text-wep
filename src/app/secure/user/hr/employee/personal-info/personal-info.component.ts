import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { UploadImageModule } from "../../../../../core/components/upload-image/upload-image.module";
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { GendersComponent } from "../../../../../core/filters/genders.component";
import { ReligionsComponent } from "../../../../../core/filters/religions.component";
import { CountriesComponent } from "../../../../../core/filters/countries.component";
import { MilitaryState } from 'src/app/core/enums/military-state';
import { enumToArray } from 'src/app/core/functions/enum-to-array';
import { MartialStatus } from 'src/app/core/enums/martial-status';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { DateFilterComponent } from 'src/app/core/filters/date-filter.component';
import { InputErrorComponent } from 'src/app/core/inputs/input-error.component';

let dir = document.dir;
let local;
if (dir === 'rtl') {
  local = 'ar-EG';
} else {
  local = 'en-GB';
}

@Component({
  selector: 'personal-info',
  templateUrl: './personal-info.component.html',
  standalone: true,
  styleUrls: ['./personal-info.component.scss'],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: local },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule, // Import MatNativeDateModule
    UploadImageModule,
    TranslateModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    GendersComponent,
    ReligionsComponent,
    CountriesComponent,
    CommonModule,
    DateFilterComponent,
    InputErrorComponent
],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalInfoComponent {
  isAdmin: boolean;
  gander: any;
  genders: any;
  regions: any;
  religions: any;
  countries: any;
  company: any;
  form: FormGroup;
  @Input() employeeId: any ;
  @Input() normalComponent = true;
  activeTab: any;
  userData: any;
  martialStatus  =enumToArray(MartialStatus)
  militaryState = enumToArray(MilitaryState)
  @Output() employeeDataChange = new EventEmitter<any>();


  constructor(private alert :AlertService, private fb: FormBuilder, private service: HrEmployeesService, private datePipe: DatePipe , private route:ActivatedRoute) {
    if(this.route.snapshot.params['id']){
      this.employeeId = this.route.snapshot.params['id'];
    }
    this.form = this.fb.group({
      id: [null],
      profileId: [null],
      genderId: [null],
      birthDay: [null],
      religonId: [null],
      idNumber: [null],
      passportNum: [null],
      nationId: [null],
      countryId: [null],
      regionId: [null],
      address: [null],
      matirialState: [null],
      childCount: [null],
      driverLicense: [null],
      exDrivingLicense: [null],
      personalEmail: [null],
      argentName: [null],
      phoneArgent: [null],
      militaryState: [null],
    });
  }

  ngOnInit() {
    this.getuserPersonalData()
  }
  get f() {
    return this.form.controls;
  }

  changeValidation(key: string) {
    if(key == 'idNumber' && this.form.get(key)?.value){
      this.form.get(key)?.setValidators([Validators.required, Validators.minLength(14), Validators.maxLength(14)]);
    }else{
      this.form.get(key)?.clearValidators();
    }
    this.form.get(key)?.updateValueAndValidity();
  }
  dateChange($event: any, key: string) {
    this.form.patchValue({
      [key]: formatDate(
        new Date($event),
        'YYYY-MM-dd',
        'en-US'
      )
    })
  }

  getuserPersonalData(){
    this.service.getUserpresonalInfo(this.employeeId).subscribe((res:any) => {
      if(res.data){
        this.userData = res.data
        this.employeeDataChange.emit(res.data);
        setTimeout(() => {
          this.form.patchValue({
            id: this.userData.id,
            profileId: this.employeeId,
            genderId: this.userData.genderId,
            birthDay: this.userData.birthDay ? new Date(this.userData.birthDay) : null,
            religonId: this.userData.religonId,
            idNumber: this.userData.idNumber,
            passportNum: this.userData.passportNum,
            nationId: this.userData.nationId,
            countryId: this.userData.countryId,
            regionId: this.userData.regionId,
            address: this.userData.address,
            matirialState: this.userData.matirialState ,
            childCount: this.userData.childCount,
            driverLicense: this.userData.driverLicense,
            exDrivingLicense: this.userData.exDrivingLicense ? new Date(this.userData.exDrivingLicense) : null,
            personalEmail: this.userData.personalEmail,
            argentName: this.userData.argentName,
            phoneArgent: this.userData.phoneArgent,
            militaryState: this.userData.militaryState,
          })
        }, 500);
      }else{}
    })
  }

  onSubmit() {
    const formattedBirthDay = this.datePipe.transform(this.form.value.birthDay, 'yyyy-MM-dd');
    const formattedExDrivingLicense = this.datePipe.transform(this.form.value.exDrivingLicense, 'yyyy-MM-dd');

    this.form.patchValue({
      profileId: this.employeeId,
      birthDay: formattedBirthDay,
      exDrivingLicense: formattedExDrivingLicense
    });

    if (this.form.valid) {
      if(this.userData){
        this.service.updateUserpresonalInfo(this.form.value).subscribe((res: any) => {
          if(res.success){
            if(this.normalComponent){
              this.alert.showAlert('updated_success')
            }
            this.getuserPersonalData();
          }
        })
      }else{
        this.service.createUserPresonalInfo(this.form.value).subscribe((res: any) => {
          if(res.success){
            if(this.normalComponent){
              this.alert.showAlert('created_success')
            }
            this.getuserPersonalData();
          }
        })
      }
    }else{
      this.form.markAllAsTouched();
      if(this.normalComponent){
        this.alert.showAlert('error' , 'bg-danger')
      }
      this.employeeDataChange.emit(null);
    }
  }

  getReligions() {
    this.service.getAllReligons().subscribe((res: any) => {
      this.religions = res.data.items;
    })
  }
  getGenders() {
    this.service.getAllGenders().subscribe((res: any) => {
      this.genders = res.data.items;
    })
  }
  getCountries() {
    this.service.getAllCountry().subscribe((res: any) => {
      this.countries = res.data.items;
    })
  }

}
