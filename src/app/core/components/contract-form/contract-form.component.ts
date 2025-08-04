import {Component, Inject, inject, OnInit} from '@angular/core';
import {CommonModule, formatDate} from '@angular/common';
import {BidiModule} from "@angular/cdk/bidi";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {FieldLengthComponent} from "../field-length.component";
import {InputErrorComponent} from "../../inputs/input-error.component";
import {InputLabelComponent} from "../../inputs/input-label.component";
import {SelectUserComponent} from "../select-user.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {DateFilterComponent} from "../../filters/date-filter.component";
import {CountriesService} from "../../services/countries.service";
import {EmploymentType} from "../../enums/employment-type";
import {enumToArray} from "../../functions/enum-to-array";
import {EmploymentStatus} from "../../enums/employment-status";
import {MatButtonModule} from "@angular/material/button";
import {SubmitButtonComponent} from "../submit-button.component";
import {ContractsService} from "../../services/contracts.service";
import {AlertService} from "../../services/alert.service";

@Component({
  selector: 'contract-form',
  standalone: true,
  imports: [CommonModule, BidiModule, FormsModule, MatDialogModule, TranslateModule, ReactiveFormsModule, InputErrorComponent, InputLabelComponent, SelectUserComponent, NgSelectModule, DateFilterComponent, MatButtonModule, SubmitButtonComponent],
  templateUrl: './contract-form.component.html',
  styleUrls: ['./contract-form.component.scss']
})
export class ContractFormComponent implements OnInit {
  countriesSer = inject(CountriesService)
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
    {label: 'male', value: 0},
    {label: 'female', value: 1}
  ];
  martialStatus = [
    {label: 'married', value: 1},
    {label: 'single', value: 2}
  ];
  typeOfContract = enumToArray(EmploymentType)
  employmentStatus = enumToArray(EmploymentStatus)
  countries: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    this.form = this.fb.group({
      user: [],
      gender: [null, Validators.required],
      birthDay: [''],
      maritalStatus: [null, Validators.required],
      countryId: [null, Validators.required],
      typeOfContract: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      statusOfContract: [null, Validators.required],
      basicSalary: [null, Validators.required],
      insuranceSalary: [null, Validators.required],
      allowance: [null, Validators.required],
      bankAccount: [''],
      bankName: [''],
      notes: [null],
      grossSalary: [null],
      targetKPIBonus: [0],
    });
  }

  ngOnInit() {
    this.countriesSer.getCountries().subscribe((res: any) => this.countries = res);
    if (this.data.isEdit) {
      console.log(this.data.contract)
      this.form.patchValue({
        ...this.data.contract,
        typeOfContract: String(this.data.contract.typeOfContract),
        statusOfContract: String(this.data.contract.statusOfContract),
        user: this.data.contract.userName
      });
      this.birthday = this.data.contract.birthDay;
      this.startDate = this.data.contract.startDate;
      this.endDate = this.data.contract.endDate;

    }
  }

  submit() {
    if (this.form.valid) {
      this.loading = true;
      let data = {
        ...this.form.value,
        userName: this.form.value.user[0].name,
        userId: this.form.value.user[0].id,
        user: null
      }
      this.service.createContract(data).subscribe((res: any) => {
        if (res.success) {
          this.service.hasChanged.next(true);
          this.alert.showAlert('contract_created');
          this.dialog.closeAll();
        } else {
          this.loading = false;
        }
      });
    }
  }

  userSelected(user: any) {
    this.form.patchValue({user: user});
  }

  birthdaySelected(date: any) {
    if (date) {
      this.form.patchValue({birthDay: formatDate(date._d, 'yyyy-MM-ddTHH:mm:ss', 'en')});
    }
  }

  startDateSelected(date: any) {
    if (date) {
      this.form.patchValue({startDate: formatDate(date._d, 'yyyy-MM-ddTHH:mm:ss', 'en')});
    }
  }

  endDateSelected(date: any) {
    if (date) {
      this.form.patchValue({endDate: formatDate(date._d, 'yyyy-MM-ddTHH:mm:ss', 'en')});
    }
  }

  get f() {
    return this.form.controls;
  }
}
