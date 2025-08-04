import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LeaveFormService {

  constructor(private http: HttpClient) {
  }

  submitLeave(data: any) {
    return this.http.post(`${environment.apiUrl}api/Leave/submit`, data)
  }

  uploadAttachments(file: any, id: any) {
    return this.http.post(`${environment.apiUrl}api/attachment/UploadWithLeaveAttachmentId?AttachmentId=${id}`, file)
  }

}
