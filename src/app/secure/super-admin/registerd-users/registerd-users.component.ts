import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { AllUsersService } from 'src/app/core/servicess/all-users.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserImageComponent } from 'src/app/core/components/user-image.component';
import { UserWithImageComponent } from 'src/app/core/components/user-with-image/user-with-image.component';
import { ArabicNumbersPipe } from 'src/app/core/pipes/arabic-numbers.pipe';
import { UserRoleComponent } from 'src/app/core/filters/user-role.component';
import { LayoutComponent } from 'src/app/core/components/layout.component';
import { DepartmentsComponent } from 'src/app/core/filters/departments.component';
import { SearchComponent } from 'src/app/core/filters/search.component';
import { SpacesService } from 'src/app/core/services/spaces.service';
import { ArabicDatePipe } from "../../../core/pipes/arabic-date.pipe";
import { HttpParams } from '@angular/common/http';
import { LoadingComponent } from "../../../core/components/loading.component";
import { NotFoundComponent } from "../../../core/components/not-found.component";
import { UserNavbarComponent } from "../../../core/components/user-navbar/user-navbar.component";
import { NgSelectModule } from '@ng-select/ng-select';
import { InputLabelComponent } from "../../../core/inputs/input-label.component";

@Component({
  selector: 'registerd-users',
  templateUrl: './registerd-users.component.html',
  standalone: true,
  styleUrls: ['./registerd-users.component.scss'],
  imports: [
    NgxPaginationModule,
    FormsModule,
    CommonModule,
    RouterModule,
    LayoutComponent,
    SearchComponent,
    DepartmentsComponent,
    UserRoleComponent,
    TranslateModule,
    UserImageComponent,
    UserWithImageComponent,
    NgSelectModule,
    ArabicNumbersPipe,
    ArabicDatePipe,
    LoadingComponent,
    NotFoundComponent,
    UserNavbarComponent,
    InputLabelComponent
],
})
export class RegisterdUsersComponent {
  allusers: any[] = [];
  totalItems: any;
  limit: any = 15;
  page:any = 1
  searchValue: any;
  roleId: any;
  loading: boolean;
  sort: any;
  isVerified: any;
  isVerifiedList: any;
  from: any;
  to: any;

  constructor(
    private service: SpacesService
  ) {}
  isEmail(cred: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(cred);
  }
  ngOnInit() {
    this.getOtps();
    localStorage.removeItem('selectedUser')
  }
  getOtps() {
    this.loading = true;
    let params = new HttpParams()
      .set('page', this.page)
      .set('limit', this.limit);

    if (this.searchValue) {
      params = params.set('search', this.searchValue);
    }
    if (this.isVerified) {
      params = params.set('isVerified', this.isVerified);
    }
    if (this.sort) {
      params = params.set('sort', this.sort);
    }
    if (this.from) {
      params = params.set('from', this.from);
    }
    if (this.to) {
      params = params.set('to', this.to);
    }

    this.service.getUsers(params).subscribe(
      (res: any) => {
        this.allusers = res.data.items;
        this.totalItems = res.data.totalItems;
        this.loading = false;
      },
      (err: any) => {
        this.loading = false;
      }
    );
  }


  pageChanged($event: number) {
    this.page = $event
    this.getOtps()
  }
  changeLimit() {
    this.getOtps()
  }
  search($event: any) {
    this.searchValue = $event;
    this.getOtps()
  }

}
