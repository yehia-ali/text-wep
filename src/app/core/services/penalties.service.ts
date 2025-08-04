import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, map, Observable, switchMap} from "rxjs";
import {environment} from "../../../environments/environment";
import { FiltersService } from './filters.service';

@Injectable({
  providedIn: 'root'
})
export class PenaltiesService extends FiltersService {
  private http = inject(HttpClient);
  
  penalties$: Observable<any> = this.hasChanged.pipe(debounceTime(400), switchMap(() => this.getPenalties().pipe(map((res: any) => {
    this.loading.next(false);
    return res
  }))));
  
  constructor() {
    super();
   }

   getPenalties() {
    const url = new URL(`${environment.apiUrl}api/Penalty/GetPenalitySpaceList`)
    this.params(url)
    return this.http.get(`${url}`).pipe(map((res: any) => {
      
      this.setMeta(res);
      return res.data.items
    }))
  }
  getEmployeeLastDeduction(employeeId: any, typeId: any) {
    const url = new URL(`${environment.apiUrl}api/Penalty/GetEmployeeLastDeduction`)
    url.searchParams.append('employeeId', employeeId);
    url.searchParams.append('TypeId', typeId);
    this.params(url)
    return this.http.get(`${url}`).pipe(map((res: any) => {
      return res
    }))
  }
  assignPenalty(data: any) {
    return this.http.post(`${environment.apiUrl}api/Penalty/ApplyPenalty`, data)
  }
  deletePenalty(id: any) {
    return this.http.delete(`${environment.apiUrl}api/Penalty/DeletePenality?id=${id}`,{})
  }

}
