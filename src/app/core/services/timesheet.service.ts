import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, debounceTime, map, Observable, switchMap} from "rxjs";
import {FormatDate} from "../functions/formatDate";
import {FiltersService} from "./filters.service";
import {Shift} from "../interfaces/shift";

@Injectable({
  providedIn: 'root'
})
export class TimesheetService extends FiltersService {
  from = new BehaviorSubject<any>(this.getFirstDayOfMonth(new Date().getFullYear(), new Date().getMonth()));
  to = new BehaviorSubject<any>(new Date());
  timesheet$: Observable<Shift[]> = this.hasChanged.pipe(debounceTime(400), switchMap(() => this.getTimesheet().pipe(map((res: any) => res))));
  override userId = new BehaviorSubject<any>(null)
  currentUserId = localStorage.getItem('id');

  constructor(private http: HttpClient) {
    super()
  }

  getTimesheet() {
    this.loading.next(true);
    let userUrl = new URL(`${environment.apiUrl}api/TimeSheet/GetUserTimeSheet?from=${FormatDate(this.from.value) || ''}&to=${FormatDate(this.to.value) || ''}&UserId=${this.userId.value}`);
    let myUrl = new URL(`${environment.apiUrl}api/TimeSheet/GetMyTimeSheet?from=${FormatDate(this.from.value) || ''}&to=${FormatDate(this.to.value) || ''}`);
    // this.params(url)
    return this.http.get(`${this.userId.value == this.currentUserId ? myUrl : userUrl}`).pipe(map((res: any) => {
      this.setMeta(res);
      this.loading.next(false);
      return res.data;
    }))
  }

  getFirstDayOfMonth(year: any, month: any) {
    return new Date(year, month, 1);
  }
}
