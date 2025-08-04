import {Injectable} from '@angular/core';
import {FiltersService} from "./filters.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, debounceTime, map, Observable, switchMap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContractsService extends FiltersService {
  list$: Observable<any> = this.hasChanged.pipe(debounceTime(400), switchMap(() => this.getContracts().pipe(map((res: any) => res))));
  contractType = new BehaviorSubject<any>(null)
  contractStatus = new BehaviorSubject<any>(null)

  constructor(private http: HttpClient) {
    super();
  }

  createContract(data: any) {
    return this.http.post(`${environment.apiUrl}api/Contract/AddContract`, data)
  }

  getContracts() {
    const url = new URL(`${environment.apiUrl}api/Contract/GetSpaceContracts`)
    this.params(url)
    this.department.value.length > 0 && this.department.value.forEach((department: any) => {
      url.searchParams.append('DepartmentId', department)
    })

    this.contractType.value && url.searchParams.append('Type', this.contractType.value)
    this.contractStatus.value && url.searchParams.append('status', this.contractStatus.value)

    this.loading.next(true)
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.setMeta(res);
      this.loading.next(false)
      return res.data.items;
    }))
  }
}
