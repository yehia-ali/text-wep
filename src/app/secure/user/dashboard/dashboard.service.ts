import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {WorkingHoursService} from "../../../core/services/working-hours.service";
import {ArabicNumbersPipe} from "../../../core/pipes/arabic-numbers.pipe";
import {environment} from "../../../../environments/environment";
import {FormatDate} from "../../../core/functions/formatDate";

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends WorkingHoursService {
  startDateFrom = new BehaviorSubject<any>(this.getFirstDayOfMonth(new Date().getFullYear(), new Date().getMonth()));
  startDateTo = new BehaviorSubject<any>(new Date());
  startDateFromValue: any = '';
  startDateToValue: any = '';

  constructor(private http: HttpClient, public override translate: TranslateService, public arabicNumbers: ArabicNumbersPipe) {
    super();
    this.startDateFrom.subscribe(res => this.startDateFromValue = res)
    this.startDateTo.subscribe(res => this.startDateToValue = res)
  }

  getFirstDayOfMonth(year: any, month: any) {
    return new Date(year, month, 1);
  }

  getDashboard() {
    return this.http.get(`${environment.apiUrl}api/Tasks/GetTaskDashBoard?startDateFrom=${FormatDate(this.startDateFromValue) || ''}&startDateTo=${FormatDate(this.startDateToValue) || ''}`)
  }

  getTeamReport() {
    return this.http.get(`${environment.apiUrl}api/Tasks/GetMyTeamReportDashBoard?startDateFrom=${FormatDate(this.startDateFromValue) || ''}&startDateTo=${FormatDate(this.startDateToValue) || ''}`)
  }

  getInboxReport() {
    return this.http.get(`${environment.apiUrl}api/Tasks/GetMyInboxReport?startDateFrom=${FormatDate(this.startDateFromValue) || ''}&startDateTo=${FormatDate(this.startDateToValue) || ''}`).pipe(map((res: any) => {
      let dashboard = res.data;
      this.workingHours(dashboard.workingHours, dashboard?.workingHours.required, dashboard?.workingHours.actual);
      return dashboard;
    }))
  }
}
