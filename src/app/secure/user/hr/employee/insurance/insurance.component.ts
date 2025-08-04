import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from "../../../../../core/components/loading.component";
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from "../../../../../core/components/not-found.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AlertService } from 'src/app/core/services/alert.service';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { HttpParams } from '@angular/common/http';
import { SearchComponent } from 'src/app/core/filters/search.component';
import { InputLabelComponent } from 'src/app/core/inputs/input-label.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputErrorComponent } from 'src/app/core/inputs/input-error.component';
import { ArabicDatePipe } from 'src/app/core/pipes/arabic-date.pipe';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'insurance',
  templateUrl: './insurance.component.html',
  standalone:true,
  styleUrls: ['./insurance.component.scss'],
  imports: [CommonModule, LoadingComponent, NotFoundComponent, TranslateModule, ArabicDatePipe, SearchComponent, MatDialogModule, FormsModule, ReactiveFormsModule, InputLabelComponent, InputErrorComponent],
})
export class InsuranceComponent {
  form:FormGroup
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  insurances: any = [];
  loading = false;
  employeeId:any = this.route.snapshot.params['id']
  activeInsurance: any;

  constructor(private service: HrEmployeesService  , private dialog : MatDialog , private route : ActivatedRoute , private alert:AlertService , private fb :FormBuilder) { }

  ngOnInit() {
    this.getInsurance()
    this.form = this.fb.group({
      insuranceNumber:['' , Validators.required],
      insuranceSalary:['' , Validators.required],
      employeeId:['']
    })
  }

  getInsurance(){
    this.loading = true
    this.service.getUserInshurance(this.employeeId).subscribe((res: any) => {
      this.loading = false;
      if(res.success){
        this.insurances = res.data;

      const activeInsurance = this.insurances.find((insurance:any) => insurance.isActive);
        console.log(activeInsurance)
      if (activeInsurance) {
        this.activeInsurance = activeInsurance;
      }

      }
    });
  }


  openDialog(): void {
    this.form.reset();
    this.dialog.open(this.dialogTemplate,{
      width:'500px',
    });
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

  createInsurance() {
    this.form.patchValue({
      employeeId : this.employeeId
    })
    if(!this.form.valid){
      this.form.patchValue({
        insuranceNumber : this.activeInsurance.insuranceNumber,
      })
    }
    if(this.form.valid){
      this.service.createUserInshurance(this.form.value).subscribe((res:any) => {
        if(res.success){
          this.alert.showAlert('insurance_created_success');
          this.getInsurance()
          this.closeDialog()
        }
      })
    }else{
      this.form.markAllAsTouched()
      this.alert.showAlert('error' , 'bg-danger');
    }
  }

}
