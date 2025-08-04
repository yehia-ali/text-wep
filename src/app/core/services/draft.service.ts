import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {BehaviorSubject, map} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DraftService {
  drafts = new BehaviorSubject([]);
  meta = new BehaviorSubject({});
  loading = new BehaviorSubject(true);
  currentPage = new BehaviorSubject({});

  constructor(private http: HttpClient) {

  }

  createDraft(data: any) {
    return this.http.post(`${environment.apiUrl}api/Draft/Create?draftType=1`, data)
  }

  getDrafts() {
    this.loading.next(true);
    return this.http.get(`${environment.apiUrl}api/Draft/GetDraftObjects?draftType=1&page=1&limit=1500`).pipe(map((res: any) => {
      this.loading.next(false);
      let drafts = res.data.items;
      let meta = {
        pageSize: res.data.pageSize,
        totalItems: res.data.totalItems,
        totalPages: res.data.totalPages,
        totalUnSeen: res.data.totalUnSeen,
        currentPage: res.data.currentPage
      }
      this.meta.next(meta)
      this.currentPage.next(meta.currentPage)
      this.drafts.next(drafts)
      return drafts
    }))
  }

  updateDraft(data: any) {
    return this.http.put(`${environment.apiUrl}api/Draft/Update?draftType=1`, data)
  }


  deleteDraft(id: number) {
    return this.http.delete(`${environment.apiUrl}api/Draft/Delete?id=${id}`)
  }
}
