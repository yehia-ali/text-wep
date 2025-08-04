import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  departments$ = new BehaviorSubject([]);
  activeManagers = new BehaviorSubject([]);
  managers$ = new BehaviorSubject([]);
  places$ = new BehaviorSubject([]);
  levels$ = new BehaviorSubject([]);
  jobTitles$ = new BehaviorSubject([]);

  constructor(private http: HttpClient) {
  }

  approveOrRejectTaskRequest(data: any) {
    return this.http.put(`${environment.apiUrl}api/TaskRequests/ApproveOrReject`, data);
  }

  forwardTask(data: any) {
    return this.http.post(`${environment.apiUrl}api/TaskRequests/Forward`, data);
  }

  getDepartments() {
    return this.http.get(`${environment.apiUrl}api/Department/GetSpaceDepartements`).pipe(map((res: any) => {
      this.departments$.next(res.data.items)
    }))
  }

  getActiveManagers() {
    return this.http.get(`${environment.apiUrl}api/Space/GetSpaceUserProfiles?roleName=SpaceManager`).pipe(map((res: any) => this.activeManagers.next(res.data.items)));
  }

  getManagers() {
    return this.http.get(`${environment.apiUrl}api/Space/GetSpaceUserProfiles?isActive=true`).pipe(map((res: any) => {
        this.managers$.next(res.data.items);
      }));
  }

  getPlaces() {
    return this.http.get(`${environment.apiUrl}api/Place/GetAllPlaces`).pipe(map((res: any) => {
      this.places$.next(res.data.items);
    }));
  }

  getLevels() {
    return this.http.get(`${environment.apiUrl}api/Level/GetAllLevels`).pipe(map((res: any) => {
      this.levels$.next(res.data.items);
    }));
  }

  getJobTitles() {
    return this.http.get(`${environment.apiUrl}api/JobTitle/GetAllJobTitles`).pipe(map((res: any) => {
      this.jobTitles$.next(res.data.items);
    }));
  }
}
