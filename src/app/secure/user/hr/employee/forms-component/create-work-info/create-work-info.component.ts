import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_DATE_FORMATS } from '../create-file/create-file.component';
import { DatePipe } from '@angular/common';
import { DepartmentsComponent } from "../../../../../../core/filters/departments.component";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/core/services/alert.service';
import { DepartmentsFormComponent } from "../../../../../../core/filters/departments-form.component";
import { SpaceUsersFormComponent } from "../../../../../../core/filters/space-users-form.component";
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'work-info',
  templateUrl: './create-work-info.component.html',
  styleUrls: ['./create-work-info.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    DepartmentsComponent,
    DepartmentsFormComponent,
    SpaceUsersFormComponent
],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe
  ],
})
export class CreateWorkInfoComponent {
  form: FormGroup;
  experienceLevels:any ;
  workTypes:any
  jobTitles:any
  employeeId:any = this.data.employeeId
  btnText:any
  expLevel: any;
  workType: any;
  jobTitle: any;

  constructor(
    private fb: FormBuilder,
    private service: HrEmployeesService ,
    private datePipe : DatePipe ,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateWorkInfoComponent>,
    private alert:AlertService,

  ) {}

  ngOnInit(): void {
    this.getAllWorkExp()
    this.getAllWorkType()
    this.getAllJobTitle()
    this.form = this.fb.group({
      id:[0],
      employeeCode : ['' ],
      workTypeId : ['' , Validators.required],
      managerId : ['' , Validators.required],
      startDate : ['' ,Validators.required],
      endDate : ['' ],
      jobTitleId : ['' , Validators.required ],
      workExpId : ['' , Validators.required],
      departmentId : ['' ,Validators.required],
      employeeId : ['' ],
      jobDescription : ['' ],
    });

    this.editMode()
    if(this.data.editMode){
      this.btnText = 'save'
    }else{
      this.form.reset()
      this.btnText = 'create'
    }
  }

  onSubmit() {
    const startDate = this.datePipe.transform(this.form.value.startDate, 'yyyy-MM-dd');
    const endDate = this.datePipe.transform(this.form.value.endDate, 'yyyy-MM-dd');
    this.form.patchValue({
      startDate: startDate,
      endDate: endDate,
      employeeId:this.employeeId
    });
    console.log(this.form.value)
    if (this.form.valid) {
      if(this.data.editMode){
        this.service.updateWorkInfo(this.form.value).subscribe((res:any) => {
          console.log(res)
          if(res.success){
            this.alert.showAlert('work_info_updated_success')
            let data = new HttpParams().set('userId' , this.employeeId).set('jobTitleId' , this.form.value.jobTitleId)
            this.service.addUserToJop(data).subscribe(() => {
              this.dialogRef.close(true);
            })

          }else{
            this.alert.showAlert('error' , 'bg-danger')
          }
        })
      }else{
        this.form.value.id = 0
        this.service.createWorkInfo(this.form.value).subscribe((res:any) => {
          console.log(res)
          if(res.success){

            this.alert.showAlert('work_info_created_success')
            let data = new HttpParams().set('userId' , this.employeeId).set('jobTitleId' , this.form.value.jobTitleId)
            this.service.addUserToJop(data).subscribe(() => {
              this.dialogRef.close(true);
            })
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

  editMode(){
    if(this.data.editMode){
      this.form.patchValue({
        id:this.data.workInfo.id,
        employeeCode : this.data.workInfo.employeeCode,
        workTypeId :this.data.workInfo.workTypeId,
        managerId :this.data.workInfo.managerId,
        startDate :this.data.workInfo.startDate,
        endDate :this.data.workInfo.endDate,
        jobTitleId :this.data.workInfo.jobTitleId,
        workExpId :this.data.workInfo.workExpId,
        departmentId :this.data.workInfo.departmentId,
        jobDescription :this.data.workInfo.jobDescription,
      });
    }
  }

  getAllWorkExp(){
    this.service.getAllWorkExp().subscribe((res:any) => {
      this.experienceLevels = res.data
    })
  }

  getAllWorkType(){
    this.service.getAllWorkType().subscribe((res:any) => {
      this.workTypes = res.data
    })
  }
  getAllJobTitle(){
    this.service.getAllJobTitles().subscribe((res:any) => {
      this.jobTitles = res.data.items
    })
  }

}
