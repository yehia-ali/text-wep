import {Injectable} from '@angular/core';
import {BehaviorSubject, map} from "rxjs";
import {Space} from "../interfaces/space";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SpacesService {
  spaces$ = new BehaviorSubject<Space[]>([]);
  currentSpace = new BehaviorSubject({})
  spaceConfiguration$ = new BehaviorSubject<any>({});

  constructor(private http: HttpClient) {
  }

  getSpaces() {
    return this.http.get(`${environment.coreBase}/api/TenantSpace/GetMySpaces`).pipe(map((res: any) => {
        let currentSpace = localStorage.getItem('space-id');
        let chatId = localStorage.getItem('chat-id');
        let spaces = res.data.items;
        this.spaces$.next(spaces);
        spaces.map((space: any) => {
          if (space.spaceId == currentSpace) {
            if (!chatId) {
              localStorage.setItem('chat-id', space.chatId)
            }
            this.currentSpace.next(space)
          }
        })
        return res.data.items;
      })
    );
  }

  getSpaceConfiguration() {
    return this.http.get(`${environment.apiUrl}api/SpaceConfigration/Get`).pipe(map((res: any) => {
      this.spaceConfiguration$.next(res.data)
      return res;
    }));
  }

  updateSpaceConfiguration(data: any) {
    return this.http.post(`${environment.apiUrl}api/Space/ConfigureSpace`, data).pipe(map((res: any) => {
      if (res.success) {
        this.getSpaceConfiguration().subscribe()
      }
      return res;
    }))
  }

  joinSpace(managerCode: string) {
    return this.http.post(`${environment.coreBase}/api/Authentication/MainJoinSpace`, {managerCode});
  }

  switchSpace(SpaceId: any) {
    return this.http.get(`${environment.coreBase}/api/TenantSpace/SetCurrentSpace`, {
      headers: new HttpHeaders().set("space-id", SpaceId),
    });
  }

  getUsers(params:HttpParams) {
    return this.http.get(`${environment.coreBase}/api/Authentication/GetOTPCodes` , {params})
  }

}
