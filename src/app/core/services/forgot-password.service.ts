import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  phone = new BehaviorSubject<any>('');
  code = new BehaviorSubject<any>('');
  token = new BehaviorSubject<any>('');

  constructor(private http: HttpClient) {
  }

  phoneNumber(data: any) {
    return this.http.put(`${environment.coreBase}/api/Authentication/ForgetPassword`, data);
  }

  verifyPhone(code: any) {
    return this.http.post(`${environment.coreBase}/api/Authentication/verifyGeneratedPassword`, {phoneNumber: this.phone.value, code});
  }

  resetPassword(password: any) {
    const data = {
      phoneNumber: this.phone.value,
      code: this.code.value,
      password,
      resetPasswordToken: this.token.value,
    };
    return this.http.put(`${environment.coreBase}/api/Authentication/UnAuthorizedChangePassword`, data);
  }
}
