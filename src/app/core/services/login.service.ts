import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map, Observable} from "rxjs";
import {SpacesService} from "./spaces.service";
import {UserService} from "./user.service";
import {RolesService} from "./roles.service";
import { IsCurrentSpaceService } from './is-current-space.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  rolesService = inject(RolesService)
  activeSpace:any
  constructor(private http: HttpClient , private currentSpace : IsCurrentSpaceService , private userSer :UserService) {
  }

  login(data: any) {
    return this.http.post<any>(`${environment.coreBase}/api/Authentication/Login`, data).pipe(map((res: any) => {
      if (res.success) {
        localStorage.setItem('token', res.data.accessToken);
        this.rolesService.isTaskedinSuperAdmin().subscribe((isSuperAdmin: boolean) => {
          if (isSuperAdmin) {
            localStorage.setItem('base-url', environment.coreBase + '/');
            localStorage.setItem('is-super-admin', 'true');
            window.location.href = '/new-spaces';
            // window.location.reload();
          } else {
            this.currentSpace.getMySpaces().subscribe((res:any) => {
              this.activeSpace = res
              if(res){
                localStorage.setItem('space-id', res.spaceId);
                localStorage.setItem('base-url', res.baseUrl);
                localStorage.setItem('chat-id', res.chatId);
                this.userSer.getMyProfile(res.spaceId, res.baseUrl).subscribe((res: any) => {
                  // if there is no errors in the user profile then redirect to the dashboard
                  if (res.success) {
                    window.location.href = '/';
                  }
                })
                // window.location.href = '/home';
              }else{
                window.location.href = '/welcome';
              }
            })
          }
        });
      }
    }));
  }

  verifyOtp(data:any){
    return this.http.get(`${environment.coreBase}/api/Authentication/CheckOtp`, {
      params:  {otp:data}
    });
  }

  verifyAccount(data:any) {
    return this.http.get(`${environment.coreBase}/api/Authentication/VerifyAccount`, {
      params:  data
    });
  }
}
