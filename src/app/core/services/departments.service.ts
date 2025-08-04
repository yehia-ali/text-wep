import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {BehaviorSubject, map} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  departments = new BehaviorSubject<any>([]);

  constructor(private http: HttpClient) {
  }

  getDepartments() {
    return this.http
      .get(`${environment.apiUrl}api/Department/GetSpaceDepartements`).pipe(map((res: any) => {
        let departments = res.data.items;
        this.departments.next(departments);
        return departments;
      }));
  }

  addDepartment(data: any) {
    return this.http.post(`${environment.apiUrl}api/Department/Create`, data);
  }

  editDepartment(data: any) {
    return this.http.put(`${environment.apiUrl}api/Department/Update`, data);
  }

}
