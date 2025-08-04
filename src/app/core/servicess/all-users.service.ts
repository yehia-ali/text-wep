import {Injectable} from '@angular/core';
import {FiltersService} from "../services/filters.service";
import {BehaviorSubject, debounceTime, map, Observable, switchMap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AllUser} from "../interfaces/all-user";

@Injectable({
  providedIn: 'root'
})
export class AllUsersService extends FiltersService {
  users$: Observable<AllUser[]> = this.hasChanged.pipe(debounceTime(400), switchMap(() => this.getUsers().pipe(map((res: any) => res))));
  selectedUsersToAddRole = new BehaviorSubject<any>([])
  selectedUsersToAddRoleValue = []

  constructor(private http: HttpClient) {
    super()
    this.selectedUsersToAddRole.subscribe(res => this.selectedUsersToAddRoleValue = res);
  }

  getUsers() {
    this.loading.next(true)
    const url = new URL(`${environment.apiUrl}api/Space/GetSpaceUserProfiles`)
    this.params(url, 'all-users');
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.loading.next(false)
      let users = res.data.items;
      this.setMeta(res);
      users.forEach((user: any) => {
        user.isSelected = this.selectedUsersToAddRoleValue.find((_user: any) => user.id == _user.id);
      });
      return users
    }))
  }

  addUserCV(data: any, id: number) {
    return this.http.post(`${environment.apiUrl}api/ProfileCv/AddUserCv?profileId=${id}`, data)
  }

  uploadCV(file: any, id: any, profileId: number) {
    return this.http.put(`${environment.apiUrl}api/ProfileCv/UploadUserCv?id=${id}&profileId=${profileId}`, file);
  }


  getRate(id: number) {
    return this.http.get(`${environment.apiUrl}api/Tasks/GetUserAverageRate?id=${id}`)
  }

  updateUser(user: any) {
    return this.http.put(`${environment.apiUrl}api/UserProfile/UpdateUserProfile`, user)
  }

  activateAccount(data: any) {
    return this.http.put(`${environment.apiUrl}api/UserProfile/UpdateActiveState`, data)
  }

  addOrRemoveRole(data: any) {
    return this.http.post(`${environment.apiUrl}api/ProfileRole/addOrRemoveRole`, data)
  }
}
