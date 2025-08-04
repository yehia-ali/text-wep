import {Injectable} from '@angular/core';
import {BehaviorSubject, debounceTime, map, Observable, switchMap} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {FiltersService} from "./filters.service";
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TeamPayslipService extends FiltersService {
  list$: Observable<any> = this.hasChanged.pipe(debounceTime(400), switchMap(() => this.getTeamPayslip().pipe(map((res: any) => res))));
  selectedUsersToTakeAction = new BehaviorSubject<any>([])
  startDate:any = this.datePipe.transform(new Date(), 'yyyy-MM-01');
  endDate: any | Date = this.datePipe.transform(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0) , 'yyyy-MM-dd');

  constructor(private http: HttpClient, private datePipe: DatePipe) {
    super();
  }


  getTeamPayslip() {
    const url = new URL(`${environment.apiUrl}api/Contract/GetPaySlipsForAdmin`)
    url.searchParams.append('EmployeeName', this.search.value)
    url.searchParams.append('From', this.startDate)
    url.searchParams.append('To', this.endDate)
    this.params(url)
    this.loading.next(true)
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.setMeta(res);
      this.loading.next(false)
      return res.data.items;
    }))
  }

  generatePayslip(params:HttpParams) {
    let url = new URL(`${environment.apiUrl}api/Contract/GeneratePayslip`);
    return this.http.get(`${url}` , {params}).pipe(map((res: any) => {
      return res;
    }))
  }

  submitPayslip(data: any) {
    let url = new URL(`${environment.apiUrl}api/Contract/SubmitPaySlip`);
    return this.http.post(`${url}`, data)
  }

  createMltiPayslips(params:HttpParams){
    return this.http.get(`${environment.apiUrl}api/Contract/GenerateBulk`, {params})
  }

  updatePayslip(status: any) {
    let url = new URL(`${environment.apiUrl}api/Contract/UpdateStatus`);
    this.selectedUsersToTakeAction.value.forEach((user: any) => {
      console.log(user)
      url.searchParams.append('PaySlipId', user.id)
    })
    url.searchParams.append('paySlipStatus', status)
    return this.http.get(`${url}`)
  }
}
