import {Injectable} from '@angular/core';
import {TeamReport} from "../interfaces/team-report";
import {BehaviorSubject, debounceTime, map, switchMap} from "rxjs";
import {FormControl} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import * as moment from "moment";
import {FormatDate} from "../functions/formatDate";

@Injectable({
  providedIn: 'root'
})
export class TeamReportService {
  teamReport = new BehaviorSubject([]);
  teamReportValue = [];
  search = new BehaviorSubject('');
  searchValue = '';
  loading = new BehaviorSubject(true);
  meta = new BehaviorSubject({});
  metaValue: any;
  currentPage = new BehaviorSubject(1);
  currentPageValue: any = 1;
  limit = new BehaviorSubject(15);
  limitValue: any;
  startDateFrom = new BehaviorSubject<any>(this.getFirstDayOfMonth(new Date().getFullYear(), new Date().getMonth()));
  startDateTo = new BehaviorSubject<any>(new Date());
  startDateFromValue: any = '';
  startDateToValue: any = '';
  selectedDate = new BehaviorSubject<any>(new FormControl(moment()));
  selectedDateValue = '';

  constructor(private http: HttpClient) {
    this.teamReport.subscribe(res => this.teamReportValue = res)
    this.search.subscribe(res => this.searchValue = res)
    this.meta.subscribe(res => this.metaValue = res)
    this.currentPage.subscribe(res => this.currentPageValue = res)
    this.startDateFrom.subscribe(res => this.startDateFromValue = res)
    this.startDateTo.subscribe(res => this.startDateToValue = res);
    this.selectedDate.subscribe(res => this.selectedDateValue = res);
    this.limit.subscribe(res => this.limitValue = res);
    this.search.pipe(debounceTime(700), switchMap(() => this.getTeamReport())).subscribe()
  }

  getTeamReport() {
    this.loading.next(true)
    const url = new URL(`${environment.apiUrl}api/Tasks/GetMyTeamReport`);
    this.currentPageValue && url.searchParams.append('page', this.currentPageValue);
    url.searchParams.append('limit', this.limitValue);
    this.searchValue && url.searchParams.append('search', this.searchValue);
    this.startDateFromValue && url.searchParams.append('startDateFrom', FormatDate(this.startDateFromValue))
    this.startDateToValue && url.searchParams.append('startDateTo', FormatDate(this.startDateToValue))
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.loading.next(false)
      let report = res.data;
      let items: TeamReport[] = res.data.items;

      items.forEach(item => {
        item.actual = Math.round(item.workingHours.actual / 60);
        item.required = Math.round(item.workingHours.required / 60);
      })

      let meta = {
        pageSize: report.pageSize,
        totalItems: report.totalItems,
        totalPages: report.totalPages,
        totalUnSeen: report.totalUnSeen,
        currentPage: report.currentPage
      }
      this.meta.next(meta)
      this.currentPage.next(report.currentPage)
      this.teamReport.next(report.items)
    }))
  }


  getFirstDayOfMonth(year: any, month: any) {
    return new Date(year, month, 1);
  }
}
