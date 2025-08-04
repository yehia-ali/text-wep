import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, debounceTime, map, Observable, switchMap} from "rxjs";
import {DatePipe, formatDate} from "@angular/common";
import {FormatDate} from "../functions/formatDate";

@Injectable({
  providedIn: 'root'
})
export class ManagerDashboardService {
  hasChanged = new BehaviorSubject(false);
  inbox$: Observable<any> = this.hasChanged.pipe(debounceTime(400), switchMap(() => this.getTeamData().pipe(map((res: any) => res))));
  assignee = new BehaviorSubject<any>([]);
  creator = new BehaviorSubject<any>([]);
  departments = new BehaviorSubject<any>([]);
  type = new BehaviorSubject<any>(null);
  priority = new BehaviorSubject<any>(null);
  project = new BehaviorSubject<any>(null);
  // startDateFrom = new BehaviorSubject<any>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  // startDateTo = new BehaviorSubject<any>(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));

  currentPage = new BehaviorSubject<number>(1);
  startDateFrom = new BehaviorSubject<any>(new Date().setHours(0, 0, 0, 0));
  startDateTo = new BehaviorSubject<any>(new Date().setHours(23, 59, 59, 999));
  limit = new BehaviorSubject(5);
  page = new BehaviorSubject(1);
  meta = new BehaviorSubject<any>(null);
  loading = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient , private datePipe : DatePipe) {
    let todayEnd = this.datePipe.transform(new Date() , 'yyyy-MM-dd')
    let startDate = this.datePipe.transform(new Date() , 'yyyy-MM-01')
    this.startDateFrom = new BehaviorSubject<any>(startDate);
    this.startDateTo = new BehaviorSubject<any>(todayEnd);
  }

  getTeamData() {
    let url = new URL(`${environment.apiUrl}api/Tasks/GetManagerDashBoard`);
    this.loading.next(true)
    url.searchParams.append('page', JSON.stringify(this.page.value));
    url.searchParams.append('limit', JSON.stringify(this.limit.value));
    url.searchParams.append('startDateFrom', this.datePipe.transform(this.startDateFrom.value , 'yyyy-MM-dd') || '');
    url.searchParams.append('startDateTo', this.datePipe.transform(this.startDateTo.value , 'yyyy-MM-dd')  || '');

    this.assignee.value?.length > 0 && this.assignee.value.map((user: any) => {
      url.searchParams.append('assignees', user.id)
    });

    this.creator.value?.length > 0 && this.creator.value.map((user: any) => {
      url.searchParams.append('creators', user.id)
    });

    this.type.value?.length > 0 && this.type.value.map((type: any) => {
      url.searchParams.append('TaskGroupType', type)
    });

    this.priority.value?.length > 0 && this.priority.value.map((priority: any) => {
      url.searchParams.append('priorities', priority)
    });

    this.project.value?.length > 0 && this.project.value.map((project: any) => {
      url.searchParams.append('projectIds', project)
    });

    this.departments.value?.length > 0 && this.departments.value.map((department: any) => {
      url.searchParams.append('assigneeDepartments', department)
    });


    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.loading.next(false);
      let meta = {
        pageSize: res.data.teamTimingVM.pageSize,
        totalItems: res.data.teamTimingVM.totalItems,
        totalPages: res.data.teamTimingVM.totalPages,
        totalUnSeen: res.data.teamTimingVM.totalUnSeen,
        currentPage: res.data.teamTimingVM.currentPage
      }
      this.currentPage.next(meta.currentPage)
      this.meta.next(meta);
      this.page.next(meta.currentPage)
      return res.data;
    }));
  }
}
