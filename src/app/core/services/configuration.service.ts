import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  updateLeaveType(data: any) {
    return this.http.post(`${environment.apiUrl}api/Leave/UpdateLeaveType`, data)
  }

  constructor(private http: HttpClient) {
  }

  addLeaves(data: any) {
    return this.http.post(`${environment.apiUrl}api/Leave/AddLeaveType`, data)
  }

  addBalance(data: any) {
    return this.http.post(`${environment.apiUrl}api/Leave/AddLeaveBalance`, data)
  }
  updateBalance(data: any) {
    return this.http.put(`${environment.apiUrl}api/Leave/UpdateLeaveBalance`, data)
  }

  addHoliday(data: any) {
    return this.http.post(`${environment.apiUrl}api/Space/AddHoliDay`, data)
  }
  editHoliday(data: any) {
    return this.http.post(`${environment.apiUrl}api/Space/UpdateHoliDay`, data)
  }
}
