import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from "../../../../../core/components/loading.component";
import { CommonModule, DatePipe } from '@angular/common';
import { NotFoundComponent } from "../../../../../core/components/not-found.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AlertService } from 'src/app/core/services/alert.service';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { InputLabelComponent } from 'src/app/core/inputs/input-label.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputErrorComponent } from 'src/app/core/inputs/input-error.component';
import { ActivatedRoute } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ArabicNumbersPipe } from "../../../../../core/pipes/arabic-numbers.pipe";
import { UserWithImageComponent } from "../../../../../core/components/user-with-image/user-with-image.component";
import { SelectUserComponent } from "../../../../../core/components/select-user.component";

@Component({
  selector: 'kpis',
  templateUrl: './kpis.component.html',
  standalone:true,
  styleUrls: ['./kpis.component.scss'],
  providers:[DatePipe],
  imports: [CommonModule, LoadingComponent, NotFoundComponent, TranslateModule, MatDialogModule, FormsModule, ReactiveFormsModule, InputLabelComponent, InputErrorComponent, MatTooltipModule, ArabicNumbersPipe, UserWithImageComponent, SelectUserComponent],
})
export class KpisComponent {
  getSelectedUsers($event: any) {
    this.selectedUsers = []
    setTimeout(() => {
      $event.forEach((user:any) => {
        this.selectedUsers.push(user.id)
      });
    }, 0);
  }

  form:FormGroup
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  @ViewChild('userDialogTemplate') userDialogTemplate!: TemplateRef<any>;
  @Input() space = false;
  spaceKpis: any = [];
  loading = false;
  employeeId:any = this.route.snapshot.params['id']
  userKpi: any;
  selectedKpi: any;
  users: any[] = [];
  selectedUsers: any[] = [];

  constructor(private datePipe : DatePipe,private service: HrEmployeesService  , private dialog : MatDialog , private route : ActivatedRoute , private alert:AlertService , private fb :FormBuilder) { }

  ngOnInit() {

    this.getKpisList()
    this.form = this.fb.group({
      tasksKPIValue:          [20 ,  [Validators.max(100), Validators.required]],
      rateKPIValue:           [20 ,  [Validators.max(100), Validators.required]],
      managerRateKPIValue:    [20 ,  [Validators.max(100), Validators.required]],
      timeSheetKPIValue:      [20 ,  [Validators.max(100), Validators.required]],
      attendanceKPIValue:     [20 ,  [Validators.max(100), Validators.required]],
    })
  }

  getKpisList(){
    this.loading = true
    this.service.getKpisList().subscribe((res: any) => {
      if(res.success){
        this.spaceKpis = res.data;
        if(!this.space){
          this.getUserKpi()
        }else{
          this.loading = false
        }
      }
    });
  }
  getUserKpi(){
    this.service.getUserKpi(this.employeeId).subscribe((res: any) => {
      this.loading = false;
      if(res.success){
        this.userKpi = res.data;
      }
    });
  }

  openDialog(kpi?:any): void {
    this.form.reset()
    this.selectedKpi = null
    setTimeout(() => {
      if(kpi){
        this.selectedKpi = kpi
      }
      this.form.patchValue({
        ...kpi
      })
      this.dialog.open(this.dialogTemplate,{
        width:'700px',
      });
    }, 0);
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  getKpiUsers(kpi:any){
    this.loading = true
    this.selectedKpi = kpi
    this.dialog.open(this.userDialogTemplate,{
      width:'700px',
    });

    this.getUsers()
  }

  getUsers(){
    this.service.getKpiUsers(this.selectedKpi.id).subscribe((res:any) => {
      this.loading = false
      this.users = res.data
    })
  }
  get f() {
    return this.form.controls;
  }

  createKpi() {

    const total = Object.values(this.form.value).reduce((sum:any, value:any) => sum + value, 0);
    let data = this.form.value

    if(this.selectedKpi && this.selectedKpi != null){
      data.id = this.selectedKpi.id
    }
    if(this.form.valid && (total == 100)){
      this.service.createOrUpdateKpi(data).subscribe((res:any) => {
        if(res.success){
          this.alert.showAlert('success');
          this.getKpisList()
          this.closeDialog()
        }
      })
    }else{
      this.form.markAllAsTouched()
      this.alert.showAlert('total_values_must_equal_100' , 'bg-danger');
    }
  }

  activateKpi(kpiId: any) {
    this.loading = true

    this.service.setUserKpi({kpiId : kpiId , userId : this.employeeId ? [this.employeeId] : this.selectedUsers}).subscribe((res:any) => {
      this.loading = false
      if(res.success){
        this.alert.showAlert('success')
        this.getKpisList()
        if(this.space){
          this.selectedUsers = []
          this.getUsers()
        }
      }
    })
  }

  deactivateKpi() {
    this.service.removeUserKpi(this.employeeId).subscribe((res:any) => {
      this.alert.showAlert('success')
      this.getKpisList()
    })
  }


}
