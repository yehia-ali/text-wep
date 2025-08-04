import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserWithImageComponent } from '../user-with-image/user-with-image.component';
// import { BasicInfoComponent } from '../../../secure/user/hr/employee/basic-info/basic-info.component';
import { PersonalInfoComponent } from '../../../secure/user/hr/employee/personal-info/personal-info.component';
import { EmployeeContractFormComponent } from '../../../secure/user/hr/employee/forms-component/contract-form/contract-form.component';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AlertService } from 'src/app/core/services/alert.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

let dir = document.dir;
let local;
if (dir === 'rtl') {
  local = 'ar-EG';
} else {
  local = 'en-GB';
}

@Component({
  selector: 'all-user-info-dialog',
  templateUrl: './all-user-info-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    UserWithImageComponent,
    // BasicInfoComponent,
    PersonalInfoComponent,
    EmployeeContractFormComponent,
    MatTooltipModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: local},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
  styleUrls: ['./all-user-info-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AllUserInfoDialogComponent {
  employeeData: any;
  hideContract: boolean;
  loadingData: boolean = false;
  userId: null;
  userData: any;
  users: any[] = [];
  contractCreatedSuccess = false
  // @ViewChild('basicInfo') basicInfo!: BasicInfoComponent;
  @ViewChild('personalInfo') personalInfo!: PersonalInfoComponent;
  @ViewChild('contractForm') contractForm!: EmployeeContractFormComponent;

  constructor(
    private service: HrEmployeesService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AllUserInfoDialogComponent>,
    private alert: AlertService
  ) {}

  ngOnInit() {
    this.users = this.data.users;
    this.userData = this.users[0];
    setTimeout(() => {
      this.personalInfo?.form.markAllAsTouched();
      this.contractForm?.form.markAllAsTouched();
      this.contractForm?.formInsurance.markAllAsTouched();
    }, 500);
  }
  contractCreated(event: any){
    if(event){
      this.alert.showAlert('data_updated_successfully');
      this.contractCreatedSuccess = true;
      if (this.users.length > 1) {
        // حذف المستخدم الحالي من القائمة
        const currentUserIndex = this.users.findIndex(user => user.id === this.userData.id);
        if (currentUserIndex !== -1) {
          this.users.splice(currentUserIndex, 1);
        }
        // إذا بقي مستخدمون، نختار التالي
        if (this.users.length > 0) {
          this.userData = this.users[0];
          this.loadingData = true;
          setTimeout(() => {
            this.loadingData = false;
            this.personalInfo?.form.markAllAsTouched();
            this.contractForm?.form.markAllAsTouched();
            this.contractForm?.formInsurance.markAllAsTouched();
          }, 1000);
        }
      } else {
        // إذا بقي مستخدم واحد فقط، نغلق الـ dialog
        this.dialogRef.close(true);
      }
    }
  };

  submit() {
    if (this.personalInfo) {
      this.personalInfo.onSubmit();
      this.personalInfo.employeeDataChange.subscribe((res: any) => {
        if (res) {
          this.alert.showAlert('data_updated_successfully');
          this.employeeData = res;
          this.contractForm.employeeData = this.employeeData;
        }
      });
    }
  }

  employeeDataChange($event: Event) {
    if ($event) {
      this.employeeData = $event;
      this.contractForm.employeeData = this.employeeData;
      this.contractForm.submit();
    }
  }

  changeUser(user: any) {
    this.userData = user;
    this.loadingData = true;
    setTimeout(() => {
      this.loadingData = false;
    }, 1000);
  }

}
