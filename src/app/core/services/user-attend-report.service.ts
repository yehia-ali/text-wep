import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserAttendReportService {

  constructor(private http: HttpClient) { }

  getSpaceMembers() {
    return this.http.get(`${environment.apiUrl}api/Space/GetSpaceUserProfiles?&isActive=true`).pipe(map(((res: any) => res.data.items)))
  }

  getUserAttendReport(month:any , userId:any){
    return this.http.get(`${environment.apiUrl}api/Attendance/GetUserAttendanceReport?Month=${month}&UserId=${userId}`).pipe(map(((res: any) => res.data)))
  }

  updateAttendance(data:any){
    return this.http.post(`${environment.apiUrl}api/Attendance/UpdateEmployeeAttendance` , data)
  }
  createAttendance(data:any){
    return this.http.post(`${environment.apiUrl}api/Attendance/CreateEmployeeAttendance` , data)
  }

}
