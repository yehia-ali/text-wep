import {Injectable} from '@angular/core';
import {BehaviorSubject, debounceTime, map, switchMap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {FiltersService} from "./filters.service";

@Injectable({
  providedIn: 'root'
})
export class TeamBalanceService extends FiltersService {
  constructor(private http: HttpClient) {
    super();
  }

  getBalances() {
    this.loading.next(true);
    const url = new URL(`${environment.apiUrl}api/Leave/GetBalances`);
    this.params(url,'team-balance');
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.loading.next(false);
      this.setMeta(res);
      return res.data
    }))
  }

  getBalancesFile() {
    this.loading.next(true);
    const url = new URL(`${environment.apiUrl}api/Leave/GetBalancesExcel`);
    this.params(url,'team-balance');
    return this.http.get(`${url}`, { responseType: 'blob' }).pipe(map((res: Blob) => {
      this.loading.next(false);
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'team-balances.xlsx';
      link.click();
      window.URL.revokeObjectURL(url);
      return res;
    }))
  }
}
