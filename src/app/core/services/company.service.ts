import {Injectable} from '@angular/core';
import {BehaviorSubject, map} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  companyProfile = new BehaviorSubject({});

  constructor(private http: HttpClient) {
  }

  getIndustries() {
    return this.http.get(`${environment.apiUrl}api/Industry/GetAll`);
  }

  updateImage(image: any) {
    return this.http.put(`${environment.apiUrl}api/Space/UpdateSpaceLogo`, image)
  }

  updateProfile(data: any) {
    return this.http.put(`${environment.apiUrl}api/Space/EditMySpaceProfile`, data)
  }


  getCompanyProfile() {
    return this.http
      .get(`${environment.apiUrl}api/Space/GetMySpaceProfile`).pipe(map((res: any) => {
        this.companyProfile.next(res.data)
        return res.data;
      }))
  }
}
