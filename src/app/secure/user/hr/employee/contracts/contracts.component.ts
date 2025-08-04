import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NotFoundComponent } from "../../../../../core/components/not-found.component";
import { SearchComponent } from "../../../../../core/filters/search.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoadingComponent } from "../../../../../core/components/loading.component";
import { EmployeeContractFormComponent } from '../forms-component/contract-form/contract-form.component';
import { CommonModule } from '@angular/common';
import { AlertService } from 'src/app/core/services/alert.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UploadImageModule } from 'src/app/core/components/upload-image/upload-image.module';
import { InputLabelComponent } from 'src/app/core/inputs/input-label.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ArabicDatePipe } from 'src/app/core/pipes/arabic-date.pipe';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { EmploymentType } from 'src/app/core/enums/employment-type';
import { enumToArray } from 'src/app/core/functions/enum-to-array';
import { EmploymentStatus } from 'src/app/core/enums/employment-status';
import { HttpParams } from '@angular/common/http';
import { StatusOfContract } from 'src/app/core/enums/contract-status';

@Component({
  selector: 'contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss'],
  standalone:true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    UploadImageModule,
    InputLabelComponent,
    TranslateModule,
    NgSelectModule,
    FormsModule,
    SearchComponent,
    RouterModule,
    CommonModule,
    NotFoundComponent,
    ArabicDatePipe,
    LoadingComponent,
    MatDialogModule
  ],
})
export class ContractsComponent {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  contractId: any;
  contractStatusTypes = enumToArray(StatusOfContract)

  searchValue: any;
  allContracts: any;
  contractStatus: any;
  company: any;
  employeeId:any = this.route.snapshot.params['id']
  loading = false;
  typeOfContract = enumToArray(EmploymentType)
  statusOfContract = enumToArray(EmploymentStatus)
  constructor(private service : HrEmployeesService , private dialog : MatDialog , private route : ActivatedRoute , private alert:AlertService) {}

  ngOnInit(){
    this.getAllContracts()
  }

  getAllContracts() {
    const params ={
      UserId:this.employeeId,
      search:this.searchValue,
    }
    this.loading = true
    this.service.getUserContracts(params).subscribe((res:any) => {
      this.allContracts = res.data
      this.loading = false
    })
  }

  addContract(){
    const dialogRef = this.dialog.open(EmployeeContractFormComponent, {
      width: '600px',
      panelClass: 'visible-dialog-container',
      data: {
        employeeId: this.employeeId,
        editMode: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.getAllContracts();
      }
    });
  }

  search($event: any) {
    this.searchValue = $event;
    this.getAllContracts();
  }


  openDialog(contract:any): void {
    this.dialog.open(this.dialogTemplate,{
      width:'500px',
    });
    this.contractId = contract.id
  }
  changeContractStatus(){
    let params = new HttpParams().set('ContractId' , this.contractId).set('status' , this.contractStatus)
    this.service.changeContractStatus(params).subscribe((res:any) => {
      if(res.success){
        this.alert.showAlert('success')
        this.getAllContracts()
        this.closeDialog()
      }
    })
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }
}
