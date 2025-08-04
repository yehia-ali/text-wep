import {Component, Inject, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BidiModule} from "@angular/cdk/bidi";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {GetAttachmentsComponent} from "../get-attachments.component";
import {InputErrorComponent} from "../../inputs/input-error.component";
import {InputLabelComponent} from "../../inputs/input-label.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SelectUserComponent} from "../select-user.component";
import {SendEmailService} from "../../services/send-email.service";
import {AlertService} from "../../services/alert.service";
import {SubmitButtonComponent} from "../submit-button.component";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'email-reply',
  standalone: true,
  imports: [CommonModule, BidiModule, MatDialogModule, TranslateModule, GetAttachmentsComponent, InputErrorComponent, InputLabelComponent, ReactiveFormsModule, SelectUserComponent, SubmitButtonComponent, MatButtonModule],
  templateUrl: './email-reply.component.html',
  styleUrls: ['./email-reply.component.scss']
})
export class EmailReplyComponent {
  service = inject(SendEmailService);
  dialog = inject(MatDialog)
  alert = inject(AlertService)
  form: FormGroup;
  loading = false;
  attachments: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    this.form = this.fb.group({
      htmlText: ['', Validators.required],
    })
  }

  submit() {
    this.loading = true;
    if (this.form.valid) {
      const data = {
        ...this.form.value,
        messageId: this.data.messageId,
        attachments: this.attachments
      }
      this.service.reply(data).subscribe((res: any) => {
        if (res.success) {
          this.alert.showAlert('email_sent');
          this.dialog.closeAll();
        } else {
          this.loading = false;
        }
      }, _ => this.loading = false)
    }
  }

  getAttachments($event: any) {
    this.attachments = []
    //   convert files to Base64 Encoded String and push to attachments array
    $event.forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        let base64 = reader.result as string;
        this.attachments.push({fileName: file.name, content: base64.split(',')[1]})
      }
      reader.readAsDataURL(file);
    })
  }


  get f() {
    return this.form.controls;
  }
}
