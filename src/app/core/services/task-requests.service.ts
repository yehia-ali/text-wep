import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {BehaviorSubject, map} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TaskRequestsService {
  taskRequests = new BehaviorSubject<any>([]);

  constructor(private http: HttpClient) {
  }

  getTaskRequests() {
    return this.http
      .get(`${environment.apiUrl}api/TaskRequests/GetMyTaskRequests`).pipe(map((res: any) => {
        let requests = res.data.items;
        this.taskRequests.next(requests);
        return requests;
      }));
  }
}
