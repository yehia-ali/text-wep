import {Injectable} from '@angular/core';
import {FiltersService} from "./filters.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LeavesDashboardService extends FiltersService {

  constructor(private http: HttpClient) {
    super()
  }

  getUserRequests() {
    let url = new URL(`${environment.apiUrl}api/Leave/GetUserRequests`)
    if(this.search.value) {
      url.searchParams.append('search', this.search.value)
    }
    if(this.employeeId.value) {
      url.searchParams.append('userId', this.employeeId.value)
    }
    this.params(url)
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.setMeta(res);
      return res.data.items
    }))
  }
  getUserBalances() {
    let url = new URL(`${environment.apiUrl}api/Leave/GetUserLeaveTypes`)
    if(this.employeeId.value) {
        url.searchParams.append('EmployeeId', this.employeeId.value)
      } 
    this.params(url)
    return this.http.get(`${url}`).pipe(map((res: any) => {
      return res
    }))
  }


  getBalances() {
    return this.http.get(`${environment.apiUrl}api/Leave/balances`)
  }
  getBalancesByYear() {
    let url = new URL(`${environment.apiUrl}api/Leave/LeavePaidUnPaidBalances`)
    this.params(url)
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.setMeta(res);
      return res
    }))
  }

}
