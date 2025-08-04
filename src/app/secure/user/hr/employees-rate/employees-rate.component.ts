import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { LayoutComponent } from '../../../../core/components/layout.component';
import { SearchComponent } from '../../../../core/filters/search.component';
import { DepartmentsComponent } from '../../../../core/filters/departments.component';
import { UserRoleComponent } from '../../../../core/filters/user-role.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserImageComponent } from '../../../../core/components/user-image.component';
import { UserWithImageComponent } from '../../../../core/components/user-with-image/user-with-image.component';
import { RouterModule } from '@angular/router';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { AllUsersService } from 'src/app/core/servicess/all-users.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ArabicNumbersPipe } from '../../../../core/pipes/arabic-numbers.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { RatingService } from 'src/app/core/services/rating.service';
import { DateRangeComponent } from "../../../../core/components/date-range/date-range.component";
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'employees-rate',
  templateUrl: './employees-rate.component.html',
  standalone: true,
  styleUrls: ['./employees-rate.component.scss'],
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
    ArabicNumbersPipe,
    DateRangeComponent
],
})
export class EmployeesRateComponent {
  startDate:any = this.datePipe.transform(new Date() , 'yyyy-MM-01');
  endDate:any = this.datePipe.transform(new Date() , 'yyyy-MM-dd');
  dateChange(event:any) {
    this.startDate = this.datePipe.transform(event.startDate , 'yyyy-MM-dd')
    this.endDate = this.datePipe.transform(event.endDate , 'yyyy-MM-dd')
    this.getRates()
  }
  allRates: any[] =[];
  totalItems: any;
  limit: any = 15;
  page:any = 1
  searchValue = '';
  roleId: any;
  selectedDepartments: any[] = [];

  constructor(
    private service: RatingService,
    private datePipe:DatePipe
  ) {}

  ngOnInit() {
    this.getRates();
    localStorage.removeItem('selectedUser')
    // this.getpersonalInformations()
  }
  getRates() {
    let params = new HttpParams()
    .set('page',this.page)
    .set('limit',this.limit)
    .set('From',this.startDate)
    .set('To',this.endDate)
    .set('search',this.searchValue)

    this.service.getAllRates(params).subscribe((res: any) => {
      this.allRates = res.data.items;
      this.totalItems = res.data.totalItems
    });
  }

  pageChanged($event: number) {
    this.page = $event
    this.getRates()
  }
  changeLimit() {
    this.getRates()
  }
  search($event: any) {
    this.searchValue = $event;
    this.getRates()
  }
  department($event: string) {
    if (typeof $event === 'string') {
      this.selectedDepartments = JSON.parse($event);
    } else {
      this.selectedDepartments = $event;
    }

    this.getRates()
  }
  userRole($event: any) {
    this.roleId = $event
    this.getRates()
  }
}
