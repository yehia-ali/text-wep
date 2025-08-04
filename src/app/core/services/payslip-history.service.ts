import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {debounceTime, map, Observable, switchMap} from "rxjs";
import {FiltersService} from "./filters.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PayslipHistoryService extends FiltersService {
  list$: Observable<any> = this.hasChanged.pipe(debounceTime(400), switchMap(() => this.getTeamPayslipHistory().pipe(map((res: any) => res))));

  constructor(private http: HttpClient) {
    super();
  }

  getTeamPayslipHistory() {
    this.loading.next(true)
    const url = new URL(`${environment.apiUrl}api/Contract/GetPaySlipsForAdmin`)
    url.searchParams.append('From', '2024-01-01T15:00:00')
    url.searchParams.append('To', '2024-11-01T15:00:00')
    url.searchParams.append('paySlipStatus', '3')
    url.searchParams.append('EmployeeName', this.search.value)
    this.params(url)
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.setMeta(res);
      this.loading.next(false)
      return res.data.items;
    }))
  }
  GetAdminPaySlips(params:any) {
    return this.http.get(`${environment.apiUrl}api/Contract/GetPaySlipsForAdmin` , {params})
  }
}
