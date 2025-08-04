import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'success-file-upload-dialog',
  templateUrl: './success-file-upload-dialog.component.html',
  styleUrls: ['./success-file-upload-dialog.component.scss'],
  standalone: true,
  imports: [MatButtonModule, TranslateModule]
})
export class SuccessFileUploadDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<SuccessFileUploadDialogComponent>)
  data = inject(MAT_DIALOG_DATA)
  translate = inject(TranslateService)
  message: string = '';
  ngOnInit(): void {
    this.message = this.data.message;
  }
  close() {
    this.dialogRef.close();
  }
}
