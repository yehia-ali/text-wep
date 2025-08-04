import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { LayoutComponent } from '../../../../core/components/layout.component';
import { SearchComponent } from '../../../../core/filters/search.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserWithImageComponent } from '../../../../core/components/user-with-image/user-with-image.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { CommonModule } from '@angular/common';
import { ArabicNumbersPipe } from '../../../../core/pipes/arabic-numbers.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { environment } from 'src/environments/environment';
import { UsersFilterComponent } from "../../../../core/components/new-filters/users-filter/users-filter.component";
import { HttpParams } from '@angular/common/http';
import { DepartmentFilterComponent } from "../../../../core/components/new-filters/departments-filter/departments-filter.component";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { AssignKpisDialogComponent } from 'src/app/core/components/assign-kpis-dialog/assign-kpis-dialog.component';
import { LoadingComponent } from "../../../../core/components/loading.component";
import { NotFoundComponent } from "../../../../core/components/not-found.component";
import { UploadFileDialogComponent } from 'src/app/core/components/upload-file-dialog/upload-file-dialog.component';
import { SuccessFileUploadDialogComponent } from 'src/app/core/components/upload-file-dialog/success-file-upload-dialog/success-file-upload-dialog.component';

@Component({
  selector: 'employees',
  templateUrl: './employees.component.html',
  standalone: true,
  styleUrls: ['./employees.component.scss'],
  imports: [
    NgxPaginationModule,
    FormsModule,
    CommonModule,
    RouterModule,
    LayoutComponent,
    SearchComponent,
    TranslateModule,
    UserWithImageComponent,
    ArabicNumbersPipe,
    UsersFilterComponent,
    DepartmentFilterComponent,
    MatCheckboxModule,
    LoadingComponent,
    NotFoundComponent
],
})

export class EmployeesComponent {
uploadFile() {
  const dialogRef = this.dialog.open(UploadFileDialogComponent, {
    width: '700px',
    maxHeight: '94vh',
  });
  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.getSpaceUsers();
    }
  });
}
loading: any = true;
assignKpis() {
  this.dialog.open(AssignKpisDialogComponent, {
    width: '100%',
    maxWidth: '94vw',
    height: '1200px',
    maxHeight: '94vh',
    data:{users:this.selectedUsers}
  })
}
  allusers: any;
  totalItems: any;
  limit: any = 15;
  page:any = 1
  searchValue: any;
  roleId: any;
  selectedDepartments: any[] = [];
  url = environment.apiUrl
  spaceId = localStorage.getItem('space-id')
  managersIds:  any[] = [];
  employeeCodeValue: any;
  kpiMode = false
  selectedUsers: any[] = [];
  allChecked: boolean;
  constructor(
    private service: HrEmployeesService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {
    this.route.data.subscribe((res:any) => {
      this.kpiMode = res.kpis
    })
  }

  ngOnInit() {
    this.getSpaceUsers();
    localStorage.removeItem('selectedUser')
  }
  getSpaceUsers() {
    this.loading = true
    let params = new HttpParams().set('page' , this.page).set('limit' , this.limit).set('isActive' , true)
    if(this.searchValue){
      params = params.set('search' , this.searchValue)
    }

    if(this.employeeCodeValue){
      params = params.set('employeeCode' , this.employeeCodeValue)
    }
    if(this.selectedDepartments.length > 0){
      this.selectedDepartments.forEach((department: number) => {
        params = params.append('departments' , department)
      });
    }
    if(this.managersIds.length > 0){
      this.managersIds.forEach((manager: number) => {
        params = params.append('managers' , manager)
      });
    }

    this.service.getUsers(params).subscribe((res: any) => {
      this.allusers = res.data.items;
      this.totalItems = res.data.totalItems
      this.loading = false
    });
  }
  pageChanged($event: number) {
    this.page = $event
    this.getSpaceUsers()
  }
  changeLimit() {
    this.getSpaceUsers()
  }
  search($event: any) {
    this.searchValue = $event;
    this.getSpaceUsers()
  }

  employeeCode($event: any) {
    this.employeeCodeValue = $event;
    this.getSpaceUsers()
  }

  department($event: any) {
    this.selectedDepartments = $event;
    this.getSpaceUsers()
  }
  userRole($event: any) {
    this.roleId = $event
    this.getSpaceUsers()
  }
  manager($event: any) {
    this.managersIds = $event
    this.getSpaceUsers()
  }


  // all users

  selectAllUsers($event: any) {
    this.allChecked = true;
    this.allusers.forEach((user:any) => {
      this.selectUser($event, user)
    })
  }

  selectUser($event: any, user: any) {
    if ($event.checked) {
      user.isSelected = true;
      this.getSelectedUsers()

    } else {
      this.allChecked = false;
      user.isSelected = false;
      this.getSelectedUsers()
    }
    this.checkAllCheckedUsers();
  }


  getSelectedUsers() {
    this.selectedUsers = this.allusers.filter((user: any) => {
      return user.isSelected
    });
    let arr: any = [];

  }


  checkAllCheckedUsers() {
    let selectedLength = 0
    this.allusers.forEach((user: any) => {
      if (user.isSelected) {
        selectedLength++;
      }
    });
    // this.allChecked = selectedLength == this.users.length;
  }
}
