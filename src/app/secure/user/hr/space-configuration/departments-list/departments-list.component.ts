import {Component, TemplateRef, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoadingComponent} from "../../../../../core/components/loading.component";
import {NotFoundComponent} from "../../../../../core/components/not-found.component";
import {TranslateModule} from "@ngx-translate/core";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { UserWithImageComponent } from "../../../../../core/components/user-with-image/user-with-image.component";
import { DepartmentFormComponent } from '../../../company/departments/department-form/department-form.component';

@Component({
  selector: 'departments-list',
  standalone: true,
  imports: [CommonModule, LoadingComponent, NotFoundComponent, TranslateModule, MatDialogModule, FormsModule, ReactiveFormsModule, UserWithImageComponent],
  templateUrl: './departments-list.component.html',
  styleUrls: ['./departments-list.component.scss']
})
export class DepartmentListComponent {
  form:FormGroup
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  departments: any = [];
  loading = false;
  constructor(private dialog: MatDialog ,private service :HrEmployeesService , private fb :FormBuilder , private alert : AlertService){}

  ngOnInit() {
    this.getAllDepartments()
    this.form = this.fb.group({
      nameAr:  ['' , Validators.required],
      name: ['' , Validators.required],
      salaryAffectTypeEnum: [1 , Validators.required],
      description:['' , Validators.required],
    })
  }

  getAllDepartments(){
    this.loading = true
    let params = new HttpParams()
    this.service.getDepartments(params).subscribe((res: any) => {
      this.departments = res.items;
      this.loading = false;
    });
  }


  openDialog(): void {
    let ref = this.dialog.open(DepartmentFormComponent,{
      width:'500px',
      data:{
        createMode:true
      }
    });

    ref.afterClosed().subscribe(() => {
      this.getAllDepartments()
    })
  }
  updateDialog(item:any): void {
    let ref = this.dialog.open(DepartmentFormComponent,{
      width:'500px',
      data:item
    });

    ref.afterClosed().subscribe(() => {
      this.getAllDepartments()
    })
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

  createDepartment() {
    if(this.form.valid){
      this.service.createDepartment(this.form.value).subscribe((res:any) => {
        if(res.success){
          this.alert.showAlert('success');
          this.getAllDepartments()
          this.closeDialog()
        }
      })
    }else{
      this.form.markAllAsTouched()
      this.alert.showAlert('error' , 'bg-danger');
    }
  }
  updateDepartment() {
    if(this.form.valid){
      this.service.createDepartment(this.form.value).subscribe((res:any) => {
        if(res.success){
          this.alert.showAlert('success');
          this.getAllDepartments()
          this.closeDialog()
        }
      })
    }else{
      this.form.markAllAsTouched()
      this.alert.showAlert('error' , 'bg-danger');
    }
  }

}
