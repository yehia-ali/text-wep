import { Injectable } from '@angular/core';
import {BehaviorSubject, map} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HierarchyService {
  teamHierarchy = new BehaviorSubject<any>([]);
  constructor(private http: HttpClient) { }

  getTeamHierarchy() {
    return this.http.get(`${environment.apiUrl}api/Space/GetTeamHierarchy`).pipe(map((res: any) => {
      this.teamHierarchy.next([res.data]);
      return [res.data]
    }))
  }
  getUserHierarchy(params:HttpParams) {
    return this.http.get(`${environment.apiUrl}api/Space/GetHierarchy` , {params}).pipe(map((res: any) => {
      return res.data
    }))
  }
  getDepartmentHierarchy(params:HttpParams) {
    return this.http.get(`${environment.apiUrl}api/Department/GetSubDepartements` , {params}).pipe(map((res: any) => {
      return res.data
    }))
  }

  getPlacesHierarchy(params:HttpParams) {
    return this.http.get(`${environment.apiUrl}api/Place/GetSubPlaces` , {params}).pipe(map((res: any) => {
      return res.data
    }))
  }
  getLevelsHierarchy(params:HttpParams) {
    return this.http.get(`${environment.apiUrl}api/Level/GetSubLevels` , {params}).pipe(map((res: any) => {
      return res.data
    }))
  }
  getJobTitleHierarchy(params:HttpParams) {
    return this.http.get(`${environment.apiUrl}api/JobTitle/GetSubJobTitles` , {params}).pipe(map((res: any) => {
      return res.data
    }))
  }
}
