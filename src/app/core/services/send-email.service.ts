import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SendEmailService {

  constructor(private http: HttpClient) {
  }

  sendEmail(data: any) {
    return this.http.post(`${environment.coreBase}/api/EmailBox/ComposeMail`, data)
  }

  forwardEmail(data: any) {
    return this.http.post(`${environment.coreBase}/api/EmailBox/Forward`, data)
  }

  reply(data: any) {
    return this.http.post(`${environment.coreBase}/api/EmailBox/Reply`, data)
  }
}
