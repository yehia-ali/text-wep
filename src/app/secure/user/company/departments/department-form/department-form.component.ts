import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {InputLabelComponent} from "../../../../../core/inputs/input-label.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputErrorComponent} from "../../../../../core/inputs/input-error.component";
import {User} from "../../../../../core/interfaces/user";
import {DepartmentsService} from "../../../../../core/services/departments.service";
import {AlertService} from "../../../../../core/services/alert.service";
import {MatButtonModule} from "@angular/material/button";
import {SelectUserComponent} from "../../../../../core/components/select-user.component";
import { DepartmentsFormComponent } from 'src/app/core/filters/departments-form.component';

@Component({
  selector: 'department-form',
  standalone: true,
  imports: [DepartmentsFormComponent , CommonModule, TranslateModule, MatDialogModule, InputLabelComponent, NgSelectModule, ReactiveFormsModule, InputErrorComponent, MatButtonModule, SelectUserComponent],
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.scss']
})
export class DepartmentFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  users: User[] = [];
  selectedUser: any = []
  departmentData: any = null;

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private service: DepartmentsService, private alertSer: AlertService, private dialog: MatDialog) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ["", Validators.required],
      parentId: [null],
      managerId: [null],
    });
    if(this.data && this.data.department){
      this.departmentData = this.data.department
    }else if(this.data && !this.data.department){
      this.departmentData = this.data
    }

    if (!this.data.createMode) {
      this.form.patchValue({
        name: this.departmentData.name,
        parentId: this.departmentData.parentId,
        managerId: this.departmentData.managerId
      });
      this.selectedUser = [{name: this.departmentData.managerName, id: this.departmentData.managerId}];
    }
  }

  getUser(user: any) {

    if(this.departmentData && user.length > 0){
      this.form.patchValue({
        managerId: user[0].id
      })
    }if(this.departmentData && user.length == 0){
      this.selectedUser = [];
      this.departmentData.managerId = 0;
      this.form.value.managerId = null;

    }
  }

  submit() {
    this.loading = true;
    if (this.data.createMode) {
      this.service.addDepartment(this.form.value).subscribe((res: any) => {
        if (res.success) {
          this.service.getDepartments().subscribe();
          this.alertSer.showAlert('department_created');
          this.dialog.closeAll();
        }
        this.loading = false;
      })
    } else {
      const data = {
        ...this.form.value,
        id: this.departmentData.id
      }
      this.service.editDepartment(data).subscribe((res: any) => {
        if (res.success) {
          this.service.getDepartments().subscribe();
          this.alertSer.showAlert('department_updated');
          this.dialog.closeAll();
        }
        this.loading = false;
      })

    }
  }
  get f() {
    return this.form.controls;
  }

}
