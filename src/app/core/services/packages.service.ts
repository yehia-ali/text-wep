import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PackagesService {
  meta = new BehaviorSubject({});
  currentPage = new BehaviorSubject({});
  packages$ = new BehaviorSubject([]);

  constructor(private http: HttpClient) {
  }

  getPackages() {
    return this.http.get(`${environment.coreBase}/api/PaymentPacakage/Get`).pipe(map((res: any) => {
      let meta = {
        pageSize: res.data.pageSize,
        totalItems: res.data.totalItems,
        totalPages: res.data.totalPages,
        totalUnSeen: res.data.totalUnSeen,
        currentPage: res.data.currentPage
      }
      this.meta.next(meta)
      this.currentPage.next(meta.currentPage)
      this.packages$.next(res.data.items);
      return res.data.items
    }))
  }

  createPackage(data: any) {
    return this.http.post(`${environment.apiUrl}api/PaymentPacakage/Create`, data)
  }

  updatePackage(data: any) {
    return this.http.put(`${environment.apiUrl}api/PaymentPacakage/Update`, data)
  }

  deletePackage(data: any) {
    return this.http.put(`${environment.apiUrl}api/PaymentPacakage/Delete`, data)
  }
}
