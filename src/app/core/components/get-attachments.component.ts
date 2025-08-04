import { AlertService } from './../services/alert.service';
import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputLabelComponent} from "../inputs/input-label.component";
import {NgxFileDropModule} from "ngx-file-drop";
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'get-attachments',
  standalone: true,
  imports: [CommonModule, InputLabelComponent, NgxFileDropModule, TranslateModule],
  template: `
    <!--        attachments     -->
    <div class="mb-50" *ngIf="!hideLabel">
      <input-label [optional]="true" key="attachments"></input-label>
    </div>

    <div class="flex-grid gap-y-2" [ngClass]="{'mb-1': (attachments && attachments.length > 0)}" *ngIf="multiFiles && attachments && attachments.length > 0">
      <div class="col-lg-6" *ngFor="let attachment of attachments; let i = index">
        <div class="attachment-card p-1 bg-gray rounded flex jcsb aic">
          <div class="start flex aic">
            <p *ngIf="attachment.name.length <= 33">{{ attachment.name }}</p>
            <p *ngIf="attachment.name.length > 33">{{ attachment.name | slice:0:33 }}...</p>
          </div>
          <div class="end img pointer" (click)="removeFile(i)">
            <i class='bx bx-x danger fs-23'></i>
          </div>
        </div>
      </div>
    </div>

    <label class="mt-50 pointer">
      <ngx-file-drop
        (onFileDrop)="dropped($event)"
        (onChanges)="dropped($event)"
        [multiple]="multiFiles"
        [accept]="accept">
        <ng-template ngx-file-drop-content-tmp let-openFileSelector="openFileSelector">
          <ng-container (click)="openFileSelector()">
            <div class="img mb-50">
              <img src="assets/images/icons/attachments.svg" width="25" alt="">
            </div>
            <div class="remove-file" (click)="removeFile(0)" *ngIf="!multiFiles && attachments && attachments.length > 0">
              <i class='bx bx-x danger fs-23'></i>
            </div>
            <div *ngIf="!multiFiles && attachments && attachments.length > 0" class="d-flex flex-column align-items-center position-relative" >
              <p class="black">{{ attachments[0].name }}</p>
            </div>
            <div class="d-flex flex-column align-items-center"  *ngIf="!multiFiles && attachments && attachments.length == 0">
              <span class="black">{{ (multiFiles ? 'drop_files' : 'drop_file') | translate }}</span>
              <span>{{ 'up_to_5_mb' | translate }}</span>
            </div>
            <div class="d-flex flex-column align-items-center"  *ngIf="multiFiles">
              <span class="black">{{ 'drop_files' | translate }}</span>
              <span>{{ 'up_to_5_mb' | translate }}</span>
            </div>

          </ng-container>
        </ng-template>
      </ngx-file-drop>
    </label>

  `,
  styles: [
    `
      .remove-file {
        position: absolute;
        top: 10px;
        inset-inline-end: 10px;
      }
    `
  ]
})
export class GetAttachmentsComponent implements OnChanges {
  @Output() getAttachments = new EventEmitter();
  @Input() attachments: any[] = [];
  @Input() hideLabel = false;
  @Input() multiFiles = true;
  @Input() accept = '.png,.jpg,.jpeg,.DOC,.DOCX,.PDF,.XLS,.xlsx,.PPT,.PPTX,.TXT';
  constructor(private alert : AlertService , private translate :TranslateService){}

  ngOnChanges() {
    if (this.attachments && this.attachments.length > 0) {
      this.attachments = this.attachments.map(key => {
        if (key.fileType != 5) {
          return {
            contentType: key.contentType,
            name: key.fileName,
            filePath: key.filePath,
            fileSize: key.fileSize,
            type: key.fileType,
            id: key.id,
            taskGroupId: key.taskGroupId,
          }
        } else {
          return
        }
      }).filter(Boolean);
    }
    this.getAttachments.emit(this.attachments);
  }

  dropped($event: any) {
    // Clear existing attachments if single file mode
    if (!this.multiFiles) {
      this.attachments = [];
    }

    for (const droppedFile of $event) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        if (file.size <= 5000000) {
          this.attachments.push(file);
          // Emit after each file is processed to ensure immediate update
          this.getAttachments.emit(this.attachments);
        } else {
          this.alert.showAlert(file.name + ' - ' + this.translate.instant('file_grater_than'), 'bg-danger');
        }
      }, (error) => {
        console.error('Error reading file:', error);
        this.alert.showAlert('file_read_error', 'bg-danger');
      });
    }
    
    // Limit to 4 files for multiFiles mode, 1 file for single mode
    const maxFiles = this.multiFiles ? 4 : 1;
    if (this.attachments.length > maxFiles) {
      this.attachments.length = maxFiles;
    }
  }

  removeFile(i: number) {
    this.attachments.splice(i, 1);
    this.getAttachments.emit(this.attachments);
  }
}
