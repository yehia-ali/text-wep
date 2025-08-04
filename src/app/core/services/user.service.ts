import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user$ = new BehaviorSubject<any>({});
  havePermissions$ = new BehaviorSubject(false);

  constructor(private http: HttpClient) {
  }

  getMyProfile(id: any = localStorage.getItem('space-id') || '', url = environment.apiUrl) {
    return this.http.get(`${url}api/UserProfile/GetMyProfile`, {
      // to set the space id when trying to check profile status on that space
      headers: new HttpHeaders().set("space-id", id),
    }).pipe(map((res: any) => {
        if (res.success) {
          localStorage.setItem('id', res.data.id)
          this.user$.next(res.data);
        }
        return res
      })
    )
  }

  getUserProfile(id: number) {
    return this.http.get(`${environment.apiUrl}api/UserProfile/GetUserProfile?id=${id}`).pipe(map((res: any) => {
      let user = res.data;
      this.getUserAverageRate(id).subscribe((rate: any) => {
        user.rate = rate.data.averageRate
      });
      return user;
    }));
  }

  getUserAverageRate(id: number) {
    return this.http.get(`${environment.apiUrl}api/Tasks/GetUserAverageRate?id=${id}`)
  }

  updateImage(image: any) {
    return this.http.put(`${environment.apiUrl}api/UserProfile/UpdateMyProfilePicture`, image);
  }

  updateProfile(data: any) {
    return this.http.put(`${environment.apiUrl}api/UserProfile/UpdateMyProfile`, data);
  }

  changePassword(data: any) {
    return this.http.put(`${environment.coreBase}/api/Authentication/ChangePassword`, data);
  }

  raiseIssue(data: any) {
    return this.http.post(`${environment.supportUrl}guestOpenticket`, data)
  }

  getCategories() {
    return this.http.get(`${environment.supportUrl}getCategories`).pipe(map((res: any) => res.data))
  }

  havePermissions(id: any) {
    return this.http.get(`${environment.apiUrl}api/Space/HavePermissionToAccesThisUserDependOnHierarchy?searchOnUserId=${id}`)
  }

  deleteAccount(password: any) {
    return this.http.delete(`${environment.apiUrl}api/Authentication/DeleteUser`, {
      body: {password}
    })
  }


}
