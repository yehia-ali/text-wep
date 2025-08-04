import { Injectable } from '@angular/core';
import {BehaviorSubject, map} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {User} from "../interfaces/user";

@Injectable({
  providedIn: 'root'
})
export class ManageUsersService {
  currentPage = new BehaviorSubject<any>(1)
  totalItems = new BehaviorSubject(0);
  users = new BehaviorSubject<any>([]);
  activeUsers = new BehaviorSubject<any>(0);
  inactiveUsers = new BehaviorSubject<any>(0);

  constructor(private http: HttpClient) {
  }

  getActiveUserProfiles() {
    const url = new URL(`${environment.apiUrl}api/Space/GetSpaceUserProfiles?limit=100`);
    url.searchParams.append('page', JSON.stringify(this.currentPage.value));
    return this.http.get(`${url}`).pipe(map((res: any) => {
      console.log(res)
      let users: User[] = res.data.items;
      this.activeUsers.next(res.data.totalActive)
      this.inactiveUsers.next(res.data.totalInActive)
      this.totalItems.next(res.data.totalItems)
      this.users.next([...this.users.value, ...users]);
      return users;
    }));
  }
}
