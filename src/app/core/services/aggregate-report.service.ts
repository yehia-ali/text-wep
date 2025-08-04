import {Injectable} from '@angular/core';
import {debounceTime, map, Observable, switchMap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {FiltersService} from "./filters.service";
import {AggregateReport} from "../interfaces/aggregate-report";

@Injectable({
  providedIn: 'root'
})
export class AggregateReportService extends FiltersService {
  reports$: Observable<AggregateReport[]> = this.hasChanged.pipe(debounceTime(400), switchMap(() => this.getReportsTable().pipe(map((res: any) => res))));

  constructor(private http: HttpClient) {
    super()
  }

  getReportsTable() {
    this.loading.next(true)
    const url = new URL(`${environment.apiUrl}api/Tasks/GetTaskPerUserReport`)
    this.params(url, 'report-table');
    return this.http.get(`${url}`).pipe(map((res: any) => {
        this.loading.next(false)
        if (res.success) {
          let reports = res.data.items;
          this.setMeta(res)
          return reports;
        }
      }
    ))
  }
}
