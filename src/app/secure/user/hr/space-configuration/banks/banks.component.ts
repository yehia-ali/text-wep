import {Component, TemplateRef, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoadingComponent} from "../../../../../core/components/loading.component";
import {NotFoundComponent} from "../../../../../core/components/not-found.component";
import {TranslateModule} from "@ngx-translate/core";
import {ArabicDatePipe} from "../../../../../core/pipes/arabic-date.pipe";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputLabelComponent } from "../../../../../core/inputs/input-label.component";
import { InputErrorComponent } from "../../../../../core/inputs/input-error.component";
import { AlertService } from 'src/app/core/services/alert.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'space-banks',
  standalone: true,
  imports: [CommonModule, LoadingComponent, NotFoundComponent, TranslateModule, ArabicDatePipe, MatDialogModule, FormsModule, ReactiveFormsModule, InputLabelComponent, InputErrorComponent , MatTooltipModule],
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.scss']
})
export class BanksComponent {
  form:FormGroup
  branchForm:FormGroup
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  banks: any = [];
  loading = false;
  branchDialog = false
  bankId: any;
  branches: any[] = [];
  showBankBranches = false
  constructor(private dialog: MatDialog ,private service :HrEmployeesService , private fb :FormBuilder , private alert : AlertService){}

  ngOnInit() {
    this.getAllBanks()
    this.form = this.fb.group({
      bankName:['',Validators.required],
    })
    this.branchForm = this.fb.group({
      branchName:['',Validators.required],
      bankId:['']
    })
  }

  getAllBanks(){
    this.loading = true
    let params = new HttpParams()
    this.service.getAllBanks().subscribe((res: any) => {
      this.banks = res.data.items;
      this.loading = false;
    });
  }


  openDialog(bank?:any , branches?:any): void {
    this.form.reset()
    this.branchForm.reset()
    this.branchDialog = false
    this.showBankBranches = false
    this.dialog.open(this.dialogTemplate,{
      width:'400px',
    });
    if(bank && !branches){
      this.branchDialog = true;
      this.bankId = bank.id
    }
    if(branches){
      this.loading = true
      this.showBankBranches = true
      this.service.getAllBankBranches(bank.id).subscribe((res:any) => {
        this.loading = false
        this.branches = res.data.items
      })
    }
  }

  createBranch() {
    this.branchForm.value.bankId = this.bankId;
    if(this.branchForm.valid){
      this.service.createBankBranch(this.branchForm.value).subscribe((res:any) => {
        if(res.success){
          this.alert.showAlert('branch_created_success');
          this.branchDialog = false
          this.closeDialog()

        }
      })
    }else{
      this.branchForm.markAllAsTouched()
      this.alert.showAlert('error' , 'bg-danger');
    }
  }
  createBank() {
    if(this.form.valid){
      this.service.createBank(this.form.value).subscribe((res:any) => {
        if(res.success){
          this.alert.showAlert('bank_created_success');
          this.getAllBanks()
          this.closeDialog()
        }
      })
    }else{
      this.form.markAllAsTouched()
      this.alert.showAlert('error' , 'bg-danger');
    }
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }
  get f() {
    return this.form.controls;
  }

  search($event: any) {
    throw new Error('Method not implemented.');
  }
}
