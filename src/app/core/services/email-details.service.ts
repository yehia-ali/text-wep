import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from 'src/environments/environment';
import {BehaviorSubject, map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EmailDetailsService {
  id = new BehaviorSubject(0)

  constructor(private http: HttpClient) {
  }

  getDetails(type: string) {
    return this.http.get(`${environment.coreBase}/api/EmailBox/GetMessageDetails?Folder=${type == 'inbox' ? 0 : 1}&MessageId=${this.id.value}`).pipe(map((res: any) => {
      let message = res.data.message;
      message.attachment = message.attachment.map((att: any) => {
        let fileData = atob(att.content).split('base64')[1];
        const byteCharacters = atob(fileData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        // determine the MIME type based on the file extension
        let fileType = att.fileName.split('.').pop();
        let mimeType = 'application/octet-stream'; // default to 'application/octet-stream' for unknown file types
        if (fileType == 'jpg' || fileType == 'jpeg') {
          mimeType = 'image/jpeg';
        } else if (fileType == 'png') {
          mimeType = 'image/png';
        } else if (fileType == 'pdf') {
          mimeType = 'application/pdf';
        } // add more file types and MIME types as needed
        const blob = new Blob([byteArray], {type: mimeType});
        att.content = URL.createObjectURL(blob);
        // i need to know if the file is image or document or video
        if (fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg') {
          att.fileType = 2;
        } else if (fileType == 'pdf' || fileType == 'doc' || fileType == 'docx' || fileType == 'xls' || fileType == 'xlsx') {
          att.fileType = 3;
        } else if (fileType == 'mp4' || fileType == 'avi' || fileType == 'mkv') {
          att.fileType = 4;
        } else {
          att.fileType = 5;
        }
        return att;
      });
      return message
    }));
  }
}
