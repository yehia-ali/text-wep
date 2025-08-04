import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import { environment } from 'src/environments/environment';
import { UploadImageModule } from 'src/app/core/components/upload-image/upload-image.module';
import { InputLabelComponent } from 'src/app/core/inputs/input-label.component';
import { User } from 'src/app/core/interfaces/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { UserService } from 'src/app/core/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { SpaceUsersFormComponent } from "../../../../../core/filters/space-users-form.component";
import { DepartmentsFormComponent } from 'src/app/core/filters/departments-form.component';
import { InputErrorComponent } from 'src/app/core/inputs/input-error.component';
@Component({
  selector: 'basic-info',
  templateUrl: './basic-info.component.html',
  standalone:true,
  styleUrls: ['./basic-info.component.scss'],
  imports: [UploadImageModule, InputLabelComponent, TranslateModule, CommonModule, ReactiveFormsModule, SpaceUsersFormComponent , DepartmentsFormComponent, InputErrorComponent]
})
export class BasicInfoComponent {
  user!: User;
  spaceId = localStorage.getItem('space-id');
  form: FormGroup;
  loading = false;
  env = environment.apiUrl;
  @Input() employeeId:any
  @Input() normalComponent = true;
  dialogMode:boolean = false;
  constructor(private service: HrEmployeesService, private userSer: UserService, private alertSer: AlertService, private fb: FormBuilder , private route : ActivatedRoute) {
    this.form = this.fb.group({
      name: ["", Validators.required],
      jobTitle: [""],
      email: [""],
      phoneNumber: ["" , [Validators.required]],
      jobDescription: [""],
      departmentId: 0,
      employeeCode: [""]
    })
  }

  ngOnInit(): void {
    if(this.route.snapshot.params['id']){
      this.employeeId = this.route.snapshot.params['id'];
    }
    this.userSer.getUserProfile(this.employeeId).subscribe(res => {
      this.user = res;

      if (res) {
        this.form.patchValue({
          name: res.name,
          jobTitle: res.jobTitle,
          email: res.email,
          phoneNumber: res.phoneNumber,
          jobDescription: res.jobDescription,
          departmentId: res.departmentId,
          managerId: res.managerId,
          employeeCode: res.employeeCode
        })
      }
    })
  }


  submit() {
    this.loading = true;
    let data ={
      id:this.employeeId,
      ...this.form.value
    }
    if(this.form.valid){
      this.service.updateUserProfile(data).subscribe((res: any) => {
        if (res.success) {
          if(this.normalComponent){
            this.alertSer.showAlert('profile_updated');
          }
        }
      });
    }else{
      this.form.markAllAsTouched();
    }
  }

  get f() {
    return this.form.controls
  }

}
