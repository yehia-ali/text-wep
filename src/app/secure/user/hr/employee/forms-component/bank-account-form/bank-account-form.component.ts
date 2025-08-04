import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UploadImageModule } from "../../../../../../core/components/upload-image/upload-image.module";
import { InputLabelComponent } from "../../../../../../core/inputs/input-label.component";
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CountriesComponent } from "../../../../../../core/filters/countries.component";
import { BanksComponent } from "../../../../../../core/filters/banks.component";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { CreateWorkInfoComponent } from '../create-work-info/create-work-info.component';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'bank-account-form',
  templateUrl: './bank-account-form.component.html',
  standalone: true,
  styleUrls: ['./bank-account-form.component.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    UploadImageModule,
    InputLabelComponent,
    TranslateModule,
    NgSelectModule,
    ReactiveFormsModule,
    CountriesComponent,
    BanksComponent
  ],
})
export class BankAccountsFormComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: HrEmployeesService ,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateWorkInfoComponent>,
    private alert:AlertService,

  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id:0,
      countryId: ['', Validators.required],
      bankId: ['', Validators.required],
      accountNumber: ['', Validators.required],
      bankBranchId: ['', Validators.required],
      employeeId: this.data.employeeId,
    });
  }

  onSubmit() {

    if (this.form.valid) {
      console.log(this.form.value);
      if(this.data.editMode){
        this.service.updateWorkInfo(this.form.value).subscribe((res:any) => {
          console.log(res)
          if(res.success){
            this.dialogRef.close(true);
            this.alert.showAlert('bank_account_updated_success')
          }else{
            this.alert.showAlert('error' , 'bg-danger')
          }
        })
      }else{
        this.service.createBankAccount(this.form.value).subscribe((res:any) => {
          console.log(res)
          if(res.success){
            this.dialogRef.close(true);
            this.alert.showAlert('bank_account_created_success')
          }else{
            this.alert.showAlert('error' , 'bg-danger')
          }
        })
      }
    } else {
      this.form.markAllAsTouched();
      this.alert.showAlert('error' , 'bg-danger')
    }
  }
}
