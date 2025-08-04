import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateTaskService {

  constructor(private http: HttpClient) {
  }
  getDetails(id:any){
    return this.http.get(`${environment.apiUrl}api/TaskGroups/GetDetails?id=${id}`).pipe(map((res: any) => {
      return res.data
    }))
  }

  createTask(data: any) {
    let url;
    if (data.taskGroupType == '8') {
      // url = `${environment.apiUrl}api/TaskGroups/CreateSignature`;
      url = `${environment.apiUrl}api/TaskGroups/Create`;
    } else {
      url = `${environment.apiUrl}api/TaskGroups/Create`;
    }
    return this.http.post(`${url}`, data);
  }
  editTask(data: any) {
    let url;
    url = `${environment.apiUrl}api/TaskGroups/EditTask`;
    return this.http.post(`${url}`, data);
  }

  uploadAttachments(file: any, id: any) {
    return this.http.post(`${environment.apiUrl}api/attachment/UploadWithAttachmentId?AttachmentId=${id}`, file);
  }

  uploadAttachmentsForDraft(file: any, id: any) {
    return this.http.post(`${environment.apiUrl}api/attachment/UploadWithAttachmentId?isdraft=true&AttachmentId=${id}`, file);
  }
  createBulkTaskByEmpCode(file: any) {
    return this.http.post(`${environment.apiUrl}api/TaskGroups/CreateBulkTaskByEmpCode`, file);
  }
  CreateBulkTaskByBrancheCode(file: any) {
    return this.http.post(`${environment.apiUrl}api/TaskGroups/CreateBulkTaskByBrancheCode`, file);
  }
  getAssineesFile(file: any , EmpCode:any) {
    return this.http.post(`${environment.apiUrl}api/TaskGroups/GetIdsFromFile?EmpCode=${EmpCode}`, file);
  }
}
