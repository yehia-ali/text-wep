import {Injectable} from '@angular/core';
import {FiltersService} from "./filters.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, debounceTime, map, switchMap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LeavesRequestsService extends FiltersService {
  list$ = this.hasChanged.pipe(debounceTime(400), switchMap(() => this.getLeaveTypes().pipe(map((res: any) => res))))
  holidaysChanged = new BehaviorSubject<boolean>(false);
  holidays$ = this.holidaysChanged.pipe(debounceTime(400), switchMap(() => this.getHolidays().pipe(map((res: any) => res))))

  constructor(private http: HttpClient) {
    super()
  }

  getManagerRequests() {
    let url = new URL(`${environment.apiUrl}api/Leave/GetManagerRequests`);
    url.searchParams.append('search', this.search.value);
    this.params(url)
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.setMeta(res);
      return res.data.items
    }))
  }
  getRequests() {
    let url = new URL(`${environment.apiUrl}api/Leave/GetManagerRequests?limit=1`);
    return this.http.get(`${url}`)
  }


  getUserLeaveTypes() {
    return this.http.get(`${environment.apiUrl}api/Leave/GetUserLeaveTypes`)
  }


  getLeaveTypes() {
    return this.http.get(`${environment.apiUrl}api/Leave/GetLeaveTypes`)
  }


  getHolidays() {
    let url = new URL(`${environment.apiUrl}api/Space/GetSpaceHolidays`)
    if(this.year.value) {
      url.searchParams.append('Year', this.year.value)
    }
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.loading.next(false);
      return res
    }))

  }


  updateRequestStatus(data: any) {
    return this.http.post(`${environment.apiUrl}api/Leave/UpdateRequestStatus`, data)
  }

  getBalances() {
    this.loading.next(true);
    const url = new URL(`${environment.apiUrl}api/Leave/GetBalances`);
    this.params(url);
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.loading.next(false);
      this.setMeta(res);
      return res.data
    }))
  }
  deleteHolidayGroup(groupIds: any) {
    let url = new URL(`${environment.apiUrl}api/Space/DeleteHoliday`);
    if(groupIds) {
      groupIds.forEach((groupId: any) => {
        url.searchParams.append('HolidaysId', groupId)
      })
    }
    this.params(url)
    return this.http.delete(`${url}`)
  }
}
