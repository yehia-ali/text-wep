import {Injectable} from '@angular/core';
import {FiltersService} from "./filters.service";
import {debounceTime, map, Observable, switchMap} from "rxjs";
import {TaskInbox} from "../interfaces/task-inbox";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EmailSentService extends FiltersService {
  sent$: Observable<TaskInbox[]> = this.hasChanged.pipe(debounceTime(400), switchMap(() => this.getInbox().pipe(map((res: any) => res))));

  constructor(private http: HttpClient) {
    super();
  }

  getInbox() {
    let url = new URL(`${environment.coreBase}/api/EmailBox/GetSentBox`);
    this.params(url);
    this.loading.next(true)
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.loading.next(false)
      let meta = {
        pageSize: this.limit.value,
        totalItems: res.data.count,
        currentPage: this.page.value,
        totalUnSeen: 0,
        totalPages: Math.ceil(res.data.count / this.limit.value),
      }
      this.meta.next(meta)
      this.currentPage.next(meta.currentPage)
      return res;
    }))
  }
}
