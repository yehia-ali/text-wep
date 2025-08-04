import { Component } from '@angular/core';
import { KpisService } from 'src/app/core/services/kpis.service';
import { HttpParams } from '@angular/common/http';
import { KpiStatus } from "../../../../core/enums/kpis-status";
import { TaskDetailsComponent } from 'src/app/secure/shared/task-details/task-details.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from "@angular/router";
import { RolesService } from '../../../..//core/services/roles.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'user-kpis',
  // standalone: true,

  templateUrl: './user-kpis.component.html',
  styleUrls: ['./user-kpis.component.scss']
})

export class UserKpisComponent {
  selectedUser: any = null
  selectedTaskStatus: any
  startDate: any = this.getFormattedDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  endDate: any = this.getFormattedDate(new Date())
  
  
  userId: any = this.route.snapshot.queryParams['userId'] || localStorage.getItem('id')
  loading: boolean;
  dashboard: any
  dashboardItems: any[] = []
  kpiStatus = KpiStatus
  isManager = false
  categoryId = this.route.snapshot.params['id'] || null
  categoryDetails: any = null
  constructor(
    private service: KpisService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private rolesSer: RolesService,
    private datePipe: DatePipe
  ) {
  
   }

  ngOnInit() {
    this.rolesSer.isManager.subscribe((res: any) => {
      this.isManager = res
    })
    if (this.categoryId) {
      this.startDate = this.route.snapshot.queryParams['startDate'];
      this.endDate = this.route.snapshot.queryParams['endDate'];  
      this.getKpisDashBoard()
    } else {
      this.getCategoryDashBoard()
    }
  }
  getFormattedDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  getfilterData($event: any, type: any) {
    if (type == 'user') {
      this.selectedUser = $event
      this.userId = this.selectedUser.id
    } else if (type == 'date') {
      this.startDate = $event.startDate
      this.endDate = $event.endDate
    } else if (type == 'state') {
      this.selectedTaskStatus = $event
    }
    if (this.userId || this.selectedTaskStatus || (this.startDate && this.endDate)) {
      this.getCategoryDashBoard()
    }
  }

  getCategoryDashBoard() {
    this.loading = true
    let params = new HttpParams();
    if (this.startDate) {
      params = params.set('from', this.startDate)
    }

    if (this.endDate) {
      params = params.set('To', this.endDate)
    }

    if (this.userId) {
      params = params.set('employeeId', this.userId)
    }


    this.service.GetUserTotalAchievement(params).subscribe((res: any) => {
      if (res.success) {

        this.dashboard = {
          ...res.data,
          achieved: res.data.percentage
        }
        this.getUserCategories()
      }
    })
  }

  getKpisDashBoard() {
    this.loading = true
    let params = new HttpParams();
    if (this.userId) {
      params = params.set('employeeId', this.userId)
    }
    if (this.categoryId) {
      params = params.set('CategoryId', this.categoryId)
    }
    if (this.startDate) {
      params = params.set('from', this.startDate)
    }

    if (this.endDate) {
      params = params.set('To', this.endDate)
    }

    this.service.getMyKpisHeader(params).subscribe((res: any) => {
      if (res.success) {
        this.dashboard = {
          ...res.data,
          achieved: res.data.percentage
        }
        this.getKpisData()
      }
    })
  }

  getUserCategories() {
    let params = new HttpParams();
    if (this.userId) {
      params = params.set('employeeId', this.userId)
    }
    if (this.categoryId) {
      params = params.set('CategoryId', this.categoryId)
    }
    if (this.startDate) {
      params = params.set('from', this.startDate)
    }

    if (this.endDate) {
      params = params.set('To', this.endDate)
    }
    this.service.getKpiCategoryForEmployee(params).subscribe((res: any) => {
      if (res.success) {
        this.dashboardItems = res.data.map((item: any) => {
          return {
            ...item,
            title: item.categoryName,
            achived: item.achieved,
            category: true
          }
        })
        this.loading = false
      }
    })
  }

  getKpisData() {
    let params = new HttpParams();
    if (this.userId) {
      params = params.set('employeeId', this.userId)
    }
    if (this.categoryId) {
      params = params.set('CategoryId', this.categoryId)
    }
    if (this.startDate) {
      params = params.set('from', this.startDate)
    }

    if (this.endDate) {
      params = params.set('To', this.endDate)
    }

    if (this.route.snapshot.queryParams['userId']) {
      this.service.getEmployeeSKpis(params).subscribe((res: any) => {
        if (res.success) {
          this.categoryDetails = res.data.items[0]
          this.dashboardItems = res.data.items.map((item: any) => {
            return {
              ...item,
              title: item.kpiName,
              achived: item.achieved,
              category: false
            }
          })
          this.loading = false
        }
      })
    } else {
      this.service.getMyKpis(params).subscribe((res: any) => {
        if (res.success) {
          this.categoryDetails = res.data.items[0]
          this.dashboardItems = res.data.items.map((item: any) => {
            return {
              ...item,
              title: item.kpiName,
              achived: item.achieved,
              category: false
            }
          })
          this.loading = false
        }
      })
    }
  }

  openDetails(item: any) {
    this.router.navigate([], {
      queryParams: { id: item.taskId },
      queryParamsHandling: 'merge',
    });

    let dialogRef = this.dialog.open(TaskDetailsComponent, {
      data: { task: item.taskId || item },
      panelClass: 'task-details-dialog',
    })
    dialogRef.afterClosed().subscribe((res: any) => {
      // this.getTasks()
    })
  }

  getKpiLink(item: any): string {
    return !this.categoryId ? `./${item.kpiCategoryId}` : `/kpis/details/${item.id}`;
  }

  getQueryParams(): any {
    const params: any = {
      startDate: this.startDate,
      endDate: this.endDate
    };
    if (this.selectedUser) {
      params.userId = this.selectedUser.id;
    }
    
    return params;
  }


}
