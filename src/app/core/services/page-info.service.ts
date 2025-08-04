import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, map, switchMap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PageInfoService {
  hasChanged = new BehaviorSubject(false)
  pageInfo = new BehaviorSubject('')
  pageInfoEnum = new BehaviorSubject('')
  pageInfoList = this.hasChanged.pipe(switchMap(() => this.getPageInfo().pipe(map((res: any) => res))))
  lang = localStorage.getItem('language') || 'en';

  constructor(private http: HttpClient) {
    combineLatest([this.pageInfoEnum, this.pageInfoList]).subscribe(([pageInfoEnumRes, pageInfoListRes]) => {
      if (!pageInfoEnumRes) {
        this.pageInfo.next('')
        return
      }
      pageInfoListRes.forEach((item: any) => {
        if (item.pageName === pageInfoEnumRes) {
          this.pageInfo.next(this.lang == 'ar' ? item.arLinkWeb : item.enLinkWeb)
        }
      })
    });
  }

  getPageInfo() {
    return this.http.get(`${environment.apiUrl}api/ApplicationConfigration/GetVideos`).pipe(map((res: any) => {
      return res.data
    }))
  }

  updatePageInfo(data: any) {
    return this.http.put(`${environment.apiUrl}api/ApplicationConfigration/UpdateVideo`, data)
  }
}
