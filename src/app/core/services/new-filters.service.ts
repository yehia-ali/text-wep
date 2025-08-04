import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewFiltersService {
  url = environment.apiUrl
  constructor(private http : HttpClient) { }

  getDepartments(params:HttpParams){
    return this.http.get(`${this.url}api/Department/GetSpaceDepartements` , {params}).pipe(
      map((res: any) => {
        return res.data;
      })
    )
  }
  getUsers(params:HttpParams){
    return this.http.get(`${this.url}api/Space/GetSpaceUserProfiles` , {params}).pipe(
      map((res: any) => {
        return res.data;
      })
    )
  }
  getJobTitles(params:HttpParams){
    return this.http.get(`${this.url}api/JobTitle/GetAllJobTitles` , {params}).pipe(
      map((res: any) => {
        return res.data;
      })
    )
  }
  getPlaces(params:HttpParams){
    return this.http.get(`${this.url}api/Place/GetAllPlaces` , {params}).pipe(
      map((res: any) => {
        return res.data;
      })
    )
  }
  getLevels(params:HttpParams){
    return this.http.get(`${this.url}api/Level/GetAllLevels` , {params}).pipe(
      map((res: any) => {
        return res.data;
      })
    )
  }

}
