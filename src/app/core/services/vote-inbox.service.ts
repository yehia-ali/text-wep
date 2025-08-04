import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FiltersService} from "./filters.service";
import {environment} from "../../../environments/environment";
import TimeLeft from "../functions/time-left";
import {debounceTime, map, Observable, switchMap} from "rxjs";
import {VoteInbox} from "../interfaces/vote-inbox";

@Injectable({
  providedIn: 'root'
})
export class VoteInboxService extends FiltersService {
  inbox$: Observable<VoteInbox[]> = this.hasChanged.pipe(debounceTime(400), switchMap(() => this.getInbox().pipe(map((res: any) => res))));

  constructor(private http: HttpClient) {
    super();
  }

  getInbox() {
    this.loading.next(true)
    const url = new URL(`${environment.apiUrl}api/VoteFormAssignee/GetMyVotes`);
    this.params(url);
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.loading.next(false)
      let inbox = res.data.items;
      inbox.forEach((vote: any) => TimeLeft(vote))
      this.setMeta(res)
      return inbox;
    }))
  }
}
