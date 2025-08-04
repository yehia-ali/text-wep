import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, debounceTime, map, Observable, switchMap} from "rxjs";
import {FormatDate} from "../functions/formatDate";
import {UserAttendance} from "../interfaces/user-attendance";
import {formatDate} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class NewAttendanceService {
  hasChanged = new BehaviorSubject(false);
  dashboard = new BehaviorSubject({});
  startDateFrom = new BehaviorSubject<any>(this.getFirstDayOfMonth(new Date().getFullYear(), new Date().getMonth()));
  startDateTo = new BehaviorSubject<any>(new Date());
  filter = new BehaviorSubject<any>(null)
  selectedUser = new BehaviorSubject(null)

  constructor(private http: HttpClient) {
  }

  getFirstDayOfMonth(year: any, month: any) {
    return new Date(year, month, 1);
  }

  getReadableDate(date: any) {
    return date.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-')
  }

  getUserAttendance() {
    let url = new URL(`${environment.apiUrl}api/Attendance/GetAttendance?dateFrom=${this.getReadableDate(this.startDateFrom.value) || ''}&dateTo=${this.getReadableDate(this.startDateTo.value) || ''}`);
    typeof this.filter.value == 'number' && url.searchParams.append('filter', String(this.filter.value));
    this.selectedUser.value && url.searchParams.append('userId', String(this.selectedUser.value));
    return this.http.get(`${url}`).pipe(map(((res: any) => {
      return res.data
    })))
  }

  getDashboard() {
    let url = new URL(`${environment.apiUrl}api/Attendance/AttentanceDashbord?startDate=${this.getReadableDate(this.startDateFrom.value) || ''}&endDate=${this.getReadableDate(this.startDateTo.value) || ''}`)
    this.selectedUser.value && url.searchParams.append('userId', String(this.selectedUser.value));
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.dashboard.next(res.data);
      return res.data;
    }))
  }
}
