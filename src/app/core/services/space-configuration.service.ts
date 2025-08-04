import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SpaceConfigurationService {
  constructor(private http: HttpClient) {
  }

  updateNumberOfUsers(data: any, spaceId: any = null) {
    return this.http.put(`${environment.apiUrl}api/PaymentOrder/UpdateUserPaymentPackage`, data, {
      headers: new HttpHeaders().set('space-id', spaceId + ''),
    })
  }

  updateSpacePackage(data: any, spaceId: any = localStorage.getItem('space-id') || null) {
    return this.http.put(`${environment.apiUrl}api/PaymentOrder/ChangePaymentPackage`, data, {
      headers: new HttpHeaders().set('space-id', spaceId + ''),
    })
  }
}
