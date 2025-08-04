import { Component, EventEmitter, Inject, inject, Input, Output } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { BidiModule } from '@angular/cdk/bidi';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatButtonModule } from '@angular/material/button';
import { SubmitButtonComponent } from '../../../../../../core/components/submit-button.component';
import { InputLabelComponent } from '../../../../../../core/inputs/input-label.component';
import { InputErrorComponent } from '../../../../../../core/inputs/input-error.component';
import { CountriesService } from '../../../../../../core/services/countries.service';
import { ContractsService } from '../../../../../../core/services/contracts.service';
import { AlertService } from '../../../../../../core/services/alert.service';
import { EmploymentType, EmploymentTypeWithOutTemporary } from '../../../../../../core/enums/employment-type';
import { EmploymentStatus } from '../../../../../../core/enums/employment-status';
import { enumToArray } from '../../../../../../core/functions/enum-to-array';
import { HrEmployeesService } from '../../../../../../core/services/hr-employees.service';
import { HttpParams } from '@angular/common/http';
import { CreateWorkInfoComponent } from '../create-work-info/create-work-info.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InputNumbersDirective } from '../../../../../../core/directives/input-numbers.directive';
import {MatRadioModule} from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'contract-form',
  standalone: true,
  imports: [
    MatCheckboxModule,
    CommonModule,
    BidiModule,
    FormsModule,
    MatDialogModule,
    TranslateModule,
    ReactiveFormsModule,
    InputErrorComponent,
    InputLabelComponent,
    NgSelectModule,
    MatButtonModule,
    SubmitButtonComponent,
    InputNumbersDirective,
    MatRadioModule,
    MatDatepickerModule,
  ],
  templateUrl: './contract-form.component.html',
  styleUrls: ['./contract-form.component.scss'],
})
export class EmployeeContractFormComponent  {
  countriesSer = inject(CountriesService);
  service = inject(ContractsService);
  dialog = inject(MatDialog);
  alert = inject(AlertService);
  birthday = '';
  startDate = '';
  endDate = '';
  dir = document.dir;
  form: FormGroup;
  loading = false;
  gender = [
    { label: 'male', value: 0 },
    { label: 'female', value: 1 },
  ];
  martialStatus = [
    { label: 'married', value: 1 },
    { label: 'single', value: 2 },
  ];
  typeOfContract = enumToArray(EmploymentTypeWithOutTemporary);
  employmentStatus = enumToArray(EmploymentStatus);
  countries: any = [];
  employeeBankAccount: any;
  banksData: any;
  selectedBank: any;
  insurances: any = [];
  activeInsurance: any ;
  formInsurance: FormGroup;
  @Input() employeeId = this.data ? this.data.employeeId : '';
  @Input() normalComponent = false;
  @Input() employeeData: any;
  @Output() contractCreated = new EventEmitter<boolean>();
  contractForm!: FormGroup;
  contractCretedSuccess: boolean = false;
  insuranceCretedSuccess: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private hrService: HrEmployeesService,
    private dialogRef: MatDialogRef<CreateWorkInfoComponent>
  ) {

    this.formInsurance = this.fb.group({
      insuranceNumber: ['', Validators.required],
      insuranceSalary: ['', Validators.required],
      employeeId: [''],
    });

    this.form = this.fb.group({
      userName: [''],
      typeOfWork: [1],
      userId: [''],
      gender: [''],
      birthDay: [''],
      maritalStatus: [''],
      countryId: [''],
      typeOfContract: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null],
      statusOfContract: [null, Validators.required],
      basicSalary: [0, [Validators.required, Validators.min(1)]],
      allowance: [null, Validators.required],
      isFullTime: [true],
      isPerHour: [false],
      hourlyRate: [0, [Validators.required, Validators.min(1)]],
      bankAccount: '',
      bankName: [''],
      deductions: [''],
      notes: [null],
      insuranceState: [true],
      targetKPIBonus: [0],
    });
  }

  ngOnInit() {
    this.getInsurance();
    this.getPersonalInfo();
    this.countriesSer
      .getCountries()
      .subscribe((res: any) => (this.countries = res));

    // Subscribe to form value changes
    this.form.get('typeOfContract')?.valueChanges.subscribe(() => {
      this.resetValidation();
    });

    if (this.data && this.data?.isEdit) {
      this.form.patchValue({
        ...this.data.contract,
        typeOfContract: String(this.data.contract.typeOfContract),
        statusOfContract: String(this.data.contract.statusOfContract),
        user: this.data.contract.userName,
      });
      this.birthday = this.data.contract.birthDay;
      this.startDate = this.data.contract.startDate;
      this.endDate = this.data.contract.endDate;
      this.employeeId = this.data.employeeId.toString();
    }

    let params = new HttpParams().set('employeeId', this.employeeId);

    this.hrService.getAllBankAccounts(params).subscribe((res: any) => {
      this.employeeBankAccount = res.data.items;
      if (!res.data.items) {
        if(!this.normalComponent){
          this.alert.showAlert('create_bank_account_first', 'bg-danger');
        }
        if(!this.normalComponent){
         this.dialog.closeAll();
        }
      }
    });
  }

  getPersonalInfo(){
    this.hrService.getUserpresonalInfo(this.employeeId).subscribe((res: any) => {
        this.employeeData = res.data;
        return this.employeeData;
    });
  }

  submit() {
    this.form.markAllAsTouched();
    this.formInsurance.markAllAsTouched();

    this.contractCretedSuccess = false;
    this.insuranceCretedSuccess = false;

    this.formInsurance.patchValue({
      employeeId: this.employeeId,
      insuranceNumber: this.formInsurance.value.insuranceNumber || this.activeInsurance?.insuranceNumber,
      insuranceSalary: this.formInsurance.value.insuranceSalary
    });

    this.form.patchValue({
      userName: this.employeeData?.employeeName,
      userId: this.employeeId,
      gender: this.employeeData?.genderId,
      birthDay: this.employeeData?.birthDay,
      maritalStatus: this.employeeData?.matirialState,
      countryId: this.employeeData?.countryId,
      bankAccount: this.selectedBank?.accountNumber,
      isFullTime: this.form.value.isFullTime,
      isPerHour: this.form.value.isPerHour,
    });

    if (this.form.valid && this.formInsurance.valid && this.form.value.insuranceState) {
      this.createContract();
    } else if (this.form.valid && !this.form.value.insuranceState) {
      this.createContract();
    }
  }

  createContract() {
    if (!this.form.value.targetKPIBonus) {
      this.form.patchValue({ targetKPIBonus: 0 });
    }
    this.loading = true;
    this.service.createContract(this.form.value).subscribe((res: any) => {
      if (res.success) {
        this.contractCretedSuccess = true;
        this.service.hasChanged.next(true);

        if (!this.normalComponent) {
          this.alert.showAlert('contract_created');
        }

        if (this.form.value.insuranceState && this.formInsurance.valid) {
          this.createInsurance();
        } else {
          this.checkState();
          if (!this.normalComponent) {
            this.dialogRef.close(true);
          }
        }
      } else {
        this.loading = false;
      }
    });
  }

  checkState() {
    if (this.contractCretedSuccess && (!this.form.value.insuranceState || this.insuranceCretedSuccess)) {
      this.contractCreated.emit(true);
    }
  }

  userSelected(user: any) {
    this.form.patchValue({ user: user });
  }

  birthdaySelected(date: any) {
    if (date) {
      this.form.patchValue({
        birthDay: formatDate(date._d, 'yyyy-MM-ddTHH:mm:ss', 'en'),
      });
    }
  }

  startDateSelected(date: any) {
    if (date) {
      this.form.patchValue({
        startDate: formatDate(date._d, 'yyyy-MM-ddTHH:mm:ss', 'en'),
      });
    }
  }

  endDateSelected(date: any) {
    if (date) {
      this.form.patchValue({
        endDate: formatDate(date._d, 'yyyy-MM-ddTHH:mm:ss', 'en'),
      });
    }
  }

  get f() {
    return this.form?.controls || {};
  }
  getInsurance() {
    this.loading = true;
    this.hrService
      .getUserInshurance(this.employeeId)
      .subscribe((res: any) => {
        this.loading = false;
        if (res.success) {
          this.insurances = res.data;

          const activeInsurance = this.insurances.find(
            (insurance: any) => insurance.isActive
          );
          if (activeInsurance) {
            this.activeInsurance = activeInsurance;
          }
        }
      });
  }

  createInsurance() {
    if (this.formInsurance.valid) {
      this.hrService
        .createUserInshurance(this.formInsurance.value)
        .subscribe((res: any) => {
          if (res.success) {
            this.insuranceCretedSuccess = true;
            if (!this.normalComponent) {
              this.alert.showAlert('insurance_created_success');
            }
            this.checkState();
            this.getInsurance();

            if (!this.normalComponent) {
              this.dialogRef.close(true);
            }
          }
        });
    } else {
      this.formInsurance.markAllAsTouched();
      if (!this.normalComponent) {
        this.alert.showAlert('error', 'bg-danger');
      }
    }
  }
  resetValidation() {
    const typeOfContract = this.form.get('typeOfContract')?.value;
    const isPerHour = this.form.get('isPerHour')?.value;
    // Reset endDate validation based on typeOfContract
    if (typeOfContract === '1') {
      this.form.get('endDate')?.clearValidators();
    } else {
      this.form.get('endDate')?.setValidators(Validators.required);
    }
    if (isPerHour) {
      this.form.get('hourlyRate')?.setValidators([Validators.required, Validators.min(1)]);
      this.form.get('basicSalary')?.clearValidators();
      this.formInsurance.get('insuranceNumber')?.clearValidators();
      this.formInsurance.get('insuranceSalary')?.clearValidators();
    } else {
      this.form.get('hourlyRate')?.clearValidators();
      this.form.get('basicSalary')?.setValidators([Validators.required, Validators.min(1)]);
      this.formInsurance.get('insuranceNumber')?.setValidators(Validators.required);
      this.formInsurance.get('insuranceSalary')?.setValidators(Validators.required);
    }
    // Update validation state
    this.form.get('hourlyRate')?.updateValueAndValidity();
    this.form.get('endDate')?.updateValueAndValidity();
    this.form.get('basicSalary')?.updateValueAndValidity();
    this.formInsurance.get('insuranceNumber')?.updateValueAndValidity();
    this.formInsurance.get('insuranceSalary')?.updateValueAndValidity();

  }
  onTypeOfWorkChange() {
    if (this.form.value.typeOfWork === 1) {
      this.form.patchValue({
        isFullTime: true,
        isPerHour: false,
      });
    }
    else if (this.form.value.typeOfWork === 2) {
      this.form.patchValue({
        isFullTime: false,
        isPerHour: false,
      });
    }
    else if (this.form.value.typeOfWork === 3) {
      this.form.patchValue({
        isFullTime: false,
        isPerHour: true,
      });
    }
    this.resetValidation();

  }
}
