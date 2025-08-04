import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetAccountService {

  constructor(private http:HttpClient) { }
  url = environment.apiUrl
  resetPassowrd(phone:any , password:any){
    return this.http.get(`${this.url}api/Authentication/ResetPassword?PhoneNumber=${phone}&newPassword=${password}`)
  }
  resetOtpCount(phone:any){
    return this.http.get(`${this.url}api/Authentication/ResetUserGenerateCount?PhoneNumber=${phone}`)
  }
}
