import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {map} from "rxjs";
import TimeLeft from "../functions/time-left";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class VoteActionsService {

  constructor(private http: HttpClient) {
  }

  getVoteAssignees(id: number, stateId = null) {
    const url = new URL(`${environment.apiUrl}api/VoteFormAssignee/GetVoteFormAssignees`);
    url.searchParams.append('voteFormId', String(id));
    stateId && url.searchParams.append('voteStates', stateId);

    return this.http.get(`${url}`).pipe(map((res: any) => {
      let assignees = res.data.items;
      assignees.forEach((assignee: any) => TimeLeft(assignee))
      return assignees
    }))
  }

  archiveVote(id: number) {
    return this.http.put(`${environment.apiUrl}api/VoteForm/Cancel`, {id})
  }

  deleteVote(id: number) {
    return this.http.put(`${environment.apiUrl}api/VoteForm/Delete`, {id})
  }
}
