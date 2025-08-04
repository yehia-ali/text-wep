import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {formatDate} from "@angular/common";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MyPayslipService {

  constructor(private http: HttpClient) {
  }

  getDetails() {
    let getFirstDayOfMonth: any = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    let lastDayOfMonth: any = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    let url = new URL(`${environment.apiUrl}api/Contract/GetMyPaySlip`);
    url.searchParams.append('date', formatDate(getFirstDayOfMonth, 'yyyy-MM-ddT05:00:00', 'en-US'));
    return this.http.get(`${url}`).pipe(map((res: any) => {
      return res.data.payslip
    }));
  }
}
