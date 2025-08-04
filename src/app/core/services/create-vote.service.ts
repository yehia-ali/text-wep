import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CreateVoteService {
  constructor(private http: HttpClient) { }

  createVote(data: any) {
    return this.http.post(`${environment.apiUrl}api/VoteForm/Create`, data)
  }
}
