import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { GetAttachmentsComponent } from "../get-attachments.component";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HrEmployeesService } from '../../services/hr-employees.service';
import { SuccessFileUploadDialogComponent } from './success-file-upload-dialog/success-file-upload-dialog.component';
import { AlertService } from '../../services/alert.service';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    TranslateModule,
    GetAttachmentsComponent,
    MatProgressBarModule
],
  selector: 'upload-file-dialog',
  templateUrl: './upload-file-dialog.component.html',
  styleUrls: ['./upload-file-dialog.component.scss']
})
export class UploadFileDialogComponent {
  service = inject(HrEmployeesService)
  dialog = inject(MatDialog)
  alert = inject(AlertService);
  stepUpload: boolean = true;
  stepProgress: boolean = false;
  stepConfirm: boolean = false;
  stepError: boolean = false;
  progress = 0;
  file: any;
  errors: any[] = [];
  validList: any[] = [];
  warningList: any[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UploadFileDialogComponent>,
  ){}
  downloadTemplate() {
    this.service.downloadBulkUsersTemplate().subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'Bulk_Employees_Template.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    });
  }
  getAttachments(attachments: any) {
    if (attachments && attachments.length > 0) {
      this.file = attachments[0];
    } else {
      this.file = undefined;
    }
  }

  reUpload() {
    this.errors = [];
    this.validList = [];
    this.file = undefined;
    this.stepUpload = true;
    this.stepError = false;
    this.stepConfirm = false;
    this.progress = 0;
  }
  uploadFile() {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      this.stepProgress = true;
      this.stepUpload = false;
      this.progress = 0;
      
      const progressInterval = setInterval(() => {
        this.progress += 1;
        if (this.progress >= 100) {
          clearInterval(progressInterval);
          this.service.uploadBulkEmployees(formData).subscribe((res: any) => {
            this.errors = res.data.errors.filter((item: any) => item.isWarning === false);
            this.validList = res.data.valid;
            this.warningList = res.data.errors.filter((item: any) => item.isWarning === true);
            this.stepUpload = false;
            this.stepProgress = false;
            if (this.errors.length > 0) {
              this.stepError = true;
            } else {
              this.stepError = false;
              this.stepConfirm = true;
            }
          }, (error) => {
            this.progress = 0;
            this.stepUpload = true;
            this.stepProgress = false;
            this.alert.showAlert('upload_error', 'bg-danger');
          });
        }
      }, 30);
    } else {
      this.alert.showAlert('select_file', 'bg-danger');
    }
  }

  confirmUpload() {
    const formData = new FormData();
    formData.append('file', this.file);
    this.service.uploadBulkEmployees(formData).subscribe((res: any) => {
      this.dialogRef.close(res);

      this.dialog.open(SuccessFileUploadDialogComponent, {
        width: '400px',
        data: {
          message: 'success_upload_file',
        }
      })
    
    }, (error) => {
      this.dialogRef.close(error);
    });
  }
}
