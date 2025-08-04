import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VoteReportService {
  constructor(private http: HttpClient) {
  }

  getReport(id: number) {
    return this.http.get(`${environment.apiUrl}api/VoteFormQuestion/GetQuestionReport?id=${id}`).pipe(map((res: any) => res.data))
  }

  getResponses(id: number, voteFormId: number) {
    return this.http.get(`${environment.apiUrl}api/VoteFormQuestionChoiceAssignee/GetVoteFormQuestionChoiceAssignee?VoteFormQuestionChoiceId=${id}&VoteFormId=${voteFormId}`)
  }
}
