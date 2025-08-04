import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaderBoardService {
  url = environment.apiUrl
  constructor(private http:HttpClient) {}

  // getLeaderBoard(params:HttpParams) {
  //   return this.http.get(`${this.url}api/Tasks/LeaderBoard` , {params}).pipe(
  //     map((res: any) => {
  //       return res.data;
  //     })
  //   );
  // }
  getKPI() {
    return this.http.get(`${this.url}api/KPIValues/GetBySpaceId`).pipe(
      map((res: any) => {
        return res.data;
      })
    );
  }
  getLeaderBoardCached(params:HttpParams) {
    return this.http.get(`${this.url}api/Tasks/LeaderBoardCached` , {params}).pipe(
      map((res: any) => {
        return res.data;
      })
    );
  }
  setKPI(data:any) {
    return this.http.post(`${this.url}api/KPIValues/edit` , data)
  }
  getLeaderBoard(params: HttpParams) {
    return this.http.get(`${this.url}api/Tasks/LeaderBoard`, { params }).pipe(
      map((res: any) => {
        const items = res.data.map((item: any, index: number) => {
          return {
            ...item,
            number: index + 1 // تعيين الترتيب من 1 إلى آخر عنصر
          };
        });
        return {
          pageSize:     res.data.pageSize,
          totalActive:  res.data.totalActive,
          totalUnSeen:  res.data.totalUnSeen,
          totalPages:   res.data.totalPages,
          totalItems:   res.data.totalItems,
          items:        items
        };
      })
    );
  }



}

