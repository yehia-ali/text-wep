import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {BehaviorSubject, map} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SpaceRequestService {
  spaceRequests = new BehaviorSubject<any>([]);

  constructor(private http: HttpClient) {
  }

  getSpaceRequests() {
    return this.http
      .get(`${environment.apiUrl}api/Space/GetSpacePendingProfiles`).pipe(map((res: any) => {
        let requests = res.data.items;
        this.spaceRequests.next(requests);
        return requests;
      }));
  }

  approveOrRejectSpace(data: any) {
    return this.http.put(
      `${environment.apiUrl}api/UserProfile/UpdateApproveState`, data);
  }

}
