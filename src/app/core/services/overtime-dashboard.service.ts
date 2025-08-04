import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FiltersService } from './filters.service';
import { BehaviorSubject, map } from 'rxjs';
import { FormatDate } from '../functions/formatDate';

@Injectable({
  providedIn: 'root',
})
export class OvertimeDashboardService extends FiltersService {
  from = new BehaviorSubject<any>(
    this.getFirstDayOfMonth(new Date().getFullYear(), new Date().getMonth())
  );
  to = new BehaviorSubject<any>(new Date());
  override userId = new BehaviorSubject<any>(null)
  status:number|string = '';
  setStatus(status:any){
    this.status = status
  }
  constructor(private http: HttpClient) {
    super();
  }

  getFirstDayOfMonth(year: any, month: any) {
    return new Date(year, month, 1);
  }

  getUserOvertimeRequests() {
    let url = new URL(`${environment.apiUrl}api/OverTime/GetMyRequests`);
    this.params(url);
    url.searchParams.append('dateFrom', `${FormatDate(this.from.value) || ''}`);
    url.searchParams.append('dateTo', `${FormatDate(this.to.value) || ''}`);
    url.searchParams.append('Status', `${this.status?.toString() ?? ''}`);
    return this.http.get(`${url}`).pipe(
      map((res: any) => {
        this.setMeta(res);
        return res.data;
      })
    );
  }

  getManagerOvertimeRequests() {
    let url = new URL(`${environment.apiUrl}api/OverTime/GetManagerRequests`);
    this.params(url);
    return this.http.get(`${url}`).pipe(
      map((res: any) => {
        this.setMeta(res);
        return res.data;
      })
    );
  }

  GetUserRequests() {

    let url = new URL(`${environment.apiUrl}api/OverTime/GetUserRequests`);
    this.params(url);
    url.searchParams.append('dateFrom', `${FormatDate(this.from.value) || ''}`);
    url.searchParams.append('dateTo', `${FormatDate(this.to.value) || ''}`);
    url.searchParams.append('Status', `${this.status?.toString() ?? ''}`);
    url.searchParams.append('UserId', `${this.userId?.toString() ?? ''}`);
    return this.http.get(`${url}`).pipe(
      map((res: any) => {
        this.setMeta(res);
        return res.data;
      })
    );
  }
}
