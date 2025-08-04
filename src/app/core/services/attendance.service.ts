import {Injectable} from '@angular/core';
import {BehaviorSubject, map} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {FormatDate} from "../functions/formatDate";

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  startDateFrom = new BehaviorSubject<any>(this.getFirstDayOfMonth(new Date().getFullYear(), new Date().getMonth()));
  startDateTo = new BehaviorSubject<any>(new Date());
  startDateFromValue: any = '';
  startDateToValue: any = '';
  userId = localStorage.getItem('id');
  selectedUser = new BehaviorSubject(null);
  selectedUserValue = null;

  constructor(private http: HttpClient) {
    this.startDateFrom.subscribe(res => this.startDateFromValue = res)
    this.startDateTo.subscribe(res => this.startDateToValue = res)
    this.selectedUser.subscribe(res => this.selectedUserValue = res)
  }

  getFirstDayOfMonth(year: any, month: any) {
    return new Date(year, month, 1);
  }

  getLastAttendance() {
    return this.http.get(`${environment.apiUrl}api/Attendance/GetTodayAttendance`)
  }

  check(data: any) {
    return this.http.post(`${environment.apiUrl}api/Attendance/Create`, data)
  }

  getAttendanceRange() {
    return this.http.get(`${environment.apiUrl}api/Attendance/GetUserAttendance?dateFrom=${FormatDate(this.startDateFromValue) || ''}&dateTo=${FormatDate(this.startDateToValue) || ''}&userId=${this.selectedUserValue || this.userId}`).pipe(map(((res: any) => {
      return res.data.items
    })))
  }

  getTeamMembers() {
    return this.http.get(`${environment.apiUrl}api/Space/GetSpaceUserProfiles?managers=${this.userId}&isActive=true`).pipe(map(((res: any) => res.data.items)))
  }

}
