import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {environment} from "../../../environments/environment";
import {TaskDetails} from "../interfaces/task-details";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'task-attachments',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
      <div class="task-attachments">
          <p class="fs-17 bold">{{'attachments' | translate}}</p>
          <div class="flex-grid">
              <ng-container *ngFor="let attachment of images">
                  <div class="col-lg-6" *ngIf="attachment.fileType != 5">
                      <div class="attachment-card p-2 bg-gray rounded flex jcsb mt-1">
                          <div class="start flex aic">
                              <div class="img mr-1">
                                  <img src="assets/images/attachments/image.svg" alt="image icon" *ngIf="attachment.fileType == 2">
                                  <img src="assets/images/attachments/document.svg" alt="image icon" *ngIf="attachment.fileType == 3 || attachment.fileType == 1 || attachment.fileType == 6">
                                  <img src="assets/images/attachments/video.svg" alt="image icon" *ngIf="attachment.fileType == 4">
                              </div>
                              <p *ngIf="attachment.fileName.length <= 20">{{attachment.fileName}}</p>
                              <p *ngIf="attachment.fileName.length > 20">{{attachment.fileName | slice:0:20}}...</p>
                          </div>
                          <a class="end pointer" [href]="env + '/' + attachment.filePath" download target="_blank">
                              <img src="assets/images/attachments/download.svg" alt="image icon">
                          </a>
                      </div>
                  </div>
              </ng-container>
          </div>
      </div>

  `,
  styles: [
  ]
})
export class TaskAttachmentsComponent {
  @Input() images!: any[];
  env = environment.apiUrl;
}
