import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, map} from "rxjs";
import {User} from "../interfaces/user";
import {SelectedUser} from "../interfaces/selected-user";

@Injectable({
  providedIn: 'root'
})
export class SelectUsersService {
  users = new BehaviorSubject<any>([]);
  currentPage = new BehaviorSubject<any>(1)
  search = new BehaviorSubject<any>('')
  employeeCode = new BehaviorSubject<any>('')
  managers = new BehaviorSubject<any>([])
  places = new BehaviorSubject<any>([])
  levels = new BehaviorSubject<any>([])
  jobTitles = new BehaviorSubject<any>([])
  departments = new BehaviorSubject<any>([])
  totalItems = new BehaviorSubject(0);
  selectedUsers$ = new BehaviorSubject<SelectedUser[]>([]);

  constructor(private http: HttpClient) {

  }

  getActiveUserProfiles(pagination = false) {
    const url = new URL(`${environment.apiUrl}api/Space/GetSpaceUserProfiles?limit=100&isActive=true`);
    url.searchParams.append('page', JSON.stringify(this.currentPage.value));
    this.search.value && url.searchParams.append('search', this.search.value);
    this.employeeCode.value && url.searchParams.append('employeeCode', this.employeeCode.value);

    this.managers.value.length > 0 && this.managers.value.forEach((manager: any) => {
      url.searchParams.append('managers', manager)
    });
    this.places.value.length > 0 && this.places.value.forEach((place: any) => {
      url.searchParams.append('places', place)
    });
    this.levels.value.length > 0 && this.levels.value.forEach((place: any) => {
      url.searchParams.append('levels', place)
    });
    this.jobTitles.value.length > 0 && this.jobTitles.value.forEach((job: any) => {
      url.searchParams.append('jobTitles', job)
    });

    this.departments.value.length > 0 && this.departments.value.forEach((department: any) => {
      url.searchParams.append('departments', department)
    });

    return this.http.get(`${url}`).pipe(map((res: any) => {
      let users: User[] = res.data.items;
      if (pagination) {
        this.users.next([...this.users.value, ...users]);
      } else {
        this.users.next(users);
      }
      this.totalItems.next(res.data.totalItems);
      return users;
    }));
  }


  getSelectedUsers(data: any) {
    let url = new URL(`${environment.apiUrl}api/UserProfile/GetUserProfileMainData`);
    data.length > 0 && data.map((user: any) => {
      url.searchParams.append('ids', user.id || user)
    })
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.selectedUsers$.next(res.data);
      return res.data
    }))
  }

  reset() {
    this.currentPage.next(1);
    this.search.next('');
    this.departments.next([]);
    this.managers.next([]);
    this.users.next([]);
    this.selectedUsers$.next([])
  }

}
