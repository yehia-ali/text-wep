import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EmailConfigurationService {

  constructor(private http: HttpClient) {
  }

  GetConfig() {
    return this.http.get(`${environment.coreBase}/api/EmailBox/GetEmailConfig`);
  }

  MailConfig(data: any) {
    return this.http.post(`${environment.coreBase}/api/EmailBox/AddMailConfigration`, data);
  }

  deleteConfig() {
    return this.http.get(`${environment.coreBase}/api/EmailBox/DeleteConfigration`);
  }
}
