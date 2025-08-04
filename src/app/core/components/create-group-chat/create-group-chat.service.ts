import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CreateGroupChatService {

  constructor(private http: HttpClient) { }

  uploadImage(uploadedFiles: any) {
    return this.http.post(`${environment.apiUrl}api/Chat/UploadAttachment`, uploadedFiles)
  }
}
