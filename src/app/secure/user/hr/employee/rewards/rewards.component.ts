import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from "../../../../../core/components/loading.component";
import { CommonModule, DatePipe } from '@angular/common';
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
import { AllRewardTypesComponent } from "../../../../../core/filters/all-reward-types.component";

@Component({
  selector: 'rewards',
  templateUrl: './rewards.component.html',
  standalone:true,
  styleUrls: ['./rewards.component.scss'],
  providers:[DatePipe],
  imports: [CommonModule, LoadingComponent, NotFoundComponent, TranslateModule, ArabicDatePipe, SearchComponent, MatDialogModule, FormsModule, ReactiveFormsModule, InputLabelComponent, InputErrorComponent, AllRewardTypesComponent],
})
export class RewardsComponent {
  form:FormGroup
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  rewards: any = [];
  loading = false;
  employeeId:any = this.route.snapshot.params['id']

  constructor(private datePipe : DatePipe,private service: HrEmployeesService  , private dialog : MatDialog , private route : ActivatedRoute , private alert:AlertService , private fb :FormBuilder) { }

  ngOnInit() {
    this.getRewards()
    this.form = this.fb.group({
      employeeId:[0],
      amount: [0 , Validators.required],
      note: ['' , Validators.required],
      date: ['' , Validators.required],
      typeId: ['' , Validators.required],
    })
  }

  getRewards(){
    this.loading = true
    const params = new HttpParams().set('employeeId'  , this.employeeId)
    this.service.getAllSalaryAffectsEmployee(params).subscribe((res: any) => {
      this.loading = false;
      if(res.success){
        this.rewards = res.data.items;
      }
    });
  }


  openDialog(): void {
    this.form.reset()
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

  createReward() {
    this.form.patchValue({
      employeeId : this.employeeId,
      date : this.datePipe.transform(new Date() , 'yyyy-MM-dd'),
    })
    console.log(this.form.value)
    if(this.form.valid){
      this.service.createSalaryAffect(this.form.value).subscribe((res:any) => {
        if(res.success){
          this.alert.showAlert('success');
          this.getRewards()
          this.closeDialog()
        }
      })
    }else{
      this.form.markAllAsTouched()
      this.alert.showAlert('error' , 'bg-danger');
    }
  }

}
