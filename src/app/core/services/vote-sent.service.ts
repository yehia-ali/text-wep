import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FiltersService} from "./filters.service";
import {environment} from "../../../environments/environment";
import {debounceTime, map, Observable, switchMap} from "rxjs";
import TimeLeft from "../functions/time-left";
import {convertToUTC} from "../functions/convertToUTC";
import {VoteSent} from "../interfaces/vote-sent";

@Injectable({
  providedIn: 'root'
})
export class VoteSentService extends FiltersService {
  sent$: Observable<VoteSent[]> = this.hasChanged.pipe(debounceTime(400), switchMap(() => this.getSent().pipe(map((res: any) => res))));

  constructor(private http: HttpClient) {
    super();
  }

  getSent() {
    this.loading.next(true)
    const url = new URL(`${environment.apiUrl}api/VoteForm/GetMyCreatedVotes`);
    this.params(url);
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.loading.next(false);
      let sent = res.data.items;
      sent.forEach((vote: VoteSent) => {
        vote.hasStarted = convertToUTC(vote.startDate).getTime() < new Date().getTime();
        vote.hasEnded = convertToUTC(vote.endDate).getTime() < new Date().getTime();
        TimeLeft(vote)
      })
      this.setMeta(res);
      return sent;
    }))
  }
}
