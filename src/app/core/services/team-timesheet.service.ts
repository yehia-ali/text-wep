import {Injectable} from '@angular/core';
import {BehaviorSubject, debounceTime, map, Observable, switchMap} from "rxjs";
import {Shift} from "../interfaces/shift";
import {FiltersService} from "./filters.service";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {FormatDate} from "../functions/formatDate";

@Injectable({
  providedIn: 'root'
})
export class TeamTimesheetService extends FiltersService {
  timesheet$: Observable<Shift[]> = this.hasChanged.pipe(debounceTime(400), switchMap(() => this.getTeamTimesheet().pipe(map((res: any) => res))));
  startDate = new BehaviorSubject<any>(this.getFirstDayOfMonth(new Date().getFullYear(), new Date().getMonth()));
  endDate = new BehaviorSubject<any>(new Date());

  constructor(private http: HttpClient) {
    super()
  }

  getTeamTimesheet() {
    this.loading.next(true);
    let url = new URL(`${environment.apiUrl}api/TimeSheet/GetTeamTimeSheet?DateFrom=${FormatDate(this.startDate.value) || ''}&DateTo=${FormatDate(this.endDate.value) || ''}`);
    this.params(url)
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.setMeta(res);
      this.loading.next(false);
      return res.data;
    }))
  }

  getFirstDayOfMonth(year: any, month: any) {
    return new Date(year, month, 1);
  }
}
