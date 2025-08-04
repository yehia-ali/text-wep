import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {convertToUTC} from "../functions/convertToUTC";
import {BehaviorSubject, debounceTime, map, Observable, switchMap} from "rxjs";
import {VoteDetails} from "../interfaces/vote-details";

@Injectable({
  providedIn: 'root'
})
export class VoteDetailsService {
  hasChanged = new BehaviorSubject(false);
  details$: Observable<VoteDetails> = this.hasChanged.pipe(debounceTime(400), switchMap(() => this.getDetails().pipe(map((res: any) => res))));
  id = new BehaviorSubject(0);
  loading = new BehaviorSubject(true);

  constructor(private http: HttpClient) {
  }

  getDetails() {
    this.loading.next(true)
    return this.http.get(`${environment.apiUrl}api/VoteFormAssignee/GetDetails?voteFormId=${this.id.value}`).pipe(map((res: any) => {
      this.loading.next(false)
      let details = res.data;
      details.hasStarted = convertToUTC(details.startDate).getTime() < new Date().getTime();
      details.hasEnded = convertToUTC(details.endDate).getTime() < new Date().getTime();
      return details
    }))
  }

  submitAnswers(data: any) {
    return this.http.post(`${environment.apiUrl}api/VoteFormQuestionChoiceAssignee/Create`, data)
  }
}
