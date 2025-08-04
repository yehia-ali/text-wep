import { Component } from '@angular/core';
import { UploadImageModule } from '../../../../../core/components/upload-image/upload-image.module';
import { InputLabelComponent } from '../../../../../core/inputs/input-label.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NotFoundComponent } from '../../../../../core/components/not-found.component';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../../../../../core/filters/search.component';
import { LoadingComponent } from '../../../../../core/components/loading.component';
import { BankAccountsFormComponent } from '../forms-component/bank-account-form/bank-account-form.component';
import { MatDialog } from '@angular/material/dialog';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmationMessageComponent } from 'src/app/core/dialogs/confirmation-message.component';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'bank-accounts',
  templateUrl: './bank-accounts.component.html',
  standalone: true,
  styleUrls: ['./bank-accounts.component.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    UploadImageModule,
    InputLabelComponent,
    TranslateModule,
    NgSelectModule,
    FormsModule,
    NotFoundComponent,
    CommonModule,
    SearchComponent,
    LoadingComponent,
  ],
})
export class BankAccountsComponent {
  loading: any;
  allBankAccounts: any[] = [];
  employeeId:any = this.route.snapshot.params['id']
  isAdmin: boolean;
  ganders: readonly any[] | null;
  company: any;
  searchValue: any;

  constructor(private service : HrEmployeesService , private dialog : MatDialog , private route : ActivatedRoute , private alert:AlertService){}

  ngOnInit(){
    this.getAllbankAccount()
  }

  addbankAccount(){
    const dialogRef = this.dialog.open(BankAccountsFormComponent, {
      width: '600px',
      panelClass: 'visible-dialog-container',
      data: {
        employeeId: this.employeeId,
        editMode: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.getAllbankAccount();
      }
    });
  }
  getAllbankAccount() {
    this.loading =true
    let params = new HttpParams();
    if(this.searchValue){
      params = params.set('search' , this.searchValue)
    }
    params = params.set('EmployeeId', this.employeeId)
    this.service.getAllBankAccounts(params).subscribe((res:any) => {
      this.allBankAccounts = res.data.items
      this.loading = false
    })
  }

  search($event: any) {
    this.searchValue = $event;
    this.getAllbankAccount();
  }

  editbankAccount(bankAccount:any){
    const dialogRef = this.dialog.open(BankAccountsFormComponent, {
      width: '600px',
      panelClass: 'visible-dialog-container',
      data: {
        bankAccount: bankAccount,
        editMode: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.getAllbankAccount();
      }
    });
  }

  deletebankAccount(id:any){
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      autoFocus: false,
      data: {
        message: 'delete_bank_account',
        btn_name: "delete",
        classes: 'bg-primary white'
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.service.deleteBankAccount(id).subscribe((res: any) => {
          if (res.success) {
            this.alert.showAlert('bank_account_deleted_success');
            this.getAllbankAccount();
          }
        })
      }
    });
  }
}
