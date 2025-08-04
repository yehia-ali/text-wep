import {Component, Inject, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BidiModule} from "@angular/cdk/bidi";
import {InputErrorComponent} from "../../inputs/input-error.component";
import {InputLabelComponent} from "../../inputs/input-label.component";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {SubmitButtonComponent} from "../submit-button.component";
import {TranslateModule} from "@ngx-translate/core";
import {AlertService} from "../../services/alert.service";
import {SelectUserComponent} from "../select-user.component";
import {GetAttachmentsComponent} from "../get-attachments.component";
import {SendEmailService} from '../../services/send-email.service';
import {UserService} from "../../services/user.service";
import {AngularEditorConfig, AngularEditorModule} from "@kolkov/angular-editor";

@Component({
  selector: 'email-form',
  standalone: true,
  imports: [CommonModule, BidiModule, InputErrorComponent, InputLabelComponent, MatButtonModule, MatCheckboxModule, MatDialogModule, NgxMaterialTimepickerModule, ReactiveFormsModule, SubmitButtonComponent, TranslateModule, SelectUserComponent, GetAttachmentsComponent, AngularEditorModule, FormsModule],
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.scss']
})
export class EmailFormComponent implements OnInit {
  service = inject(SendEmailService);
  userSer = inject(UserService);
  dialog = inject(MatDialog)
  alert = inject(AlertService)
  form: FormGroup;
  loading = false;
  attachments: any = [];
  ccAssignees: any = []
  assignees: any = []
  mailConfigured: any;
  toText = '';
  ccText = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    this.form = this.fb.group({
      subject: ['', Validators.required],
      htmlBody: [''],
    })
  }

  ngOnInit() {

    this.userSer.user$.subscribe(res => {
      this.mailConfigured = res.isMailConfigured;
    })

    if (this.data.isForward) {
      this.form.patchValue({
        subject: "Fwd: " + this.data.subject
      })
    }

    if (this.data.isReply) {
      this.form.patchValue({
        subject: "Re: " + this.data.subject
      })
    }
  }

  submit() {
    this.loading = true;
    if (this.form.valid && this.assignees && !this.data?.isForward && !this.data?.isReply) {
      if (this.toText) this.assignees.push(...this.toText.split(' '))
      if (this.ccText) this.ccAssignees.push(...this.ccText.split(' '))
      const data = {
        ...this.form.value,
        to: this.assignees,
        cc: this.ccAssignees,
        attachments: this.attachments
      }
      this.service.sendEmail(data).subscribe((res: any) => {
        if (res.success) {
          this.alert.showAlert('email_sent');
          this.dialog.closeAll();
        } else {
          this.loading = false;
        }
      }, _ => this.loading = false)
    }

    if (this.data.isForward) {
      this.forward()
    }

    if (this.data.isReply) {
      this.reply()
    }
  }

  forward() {
    if (this.toText) this.assignees.push(...this.toText.split(' '))
    if (this.ccText) this.ccAssignees.push(...this.ccText.split(' '))
    const data = {
      htmltext: this.form.value.htmlBody,
      toEmail: this.assignees,
      cc: this.ccAssignees,
      attachments: this.attachments,
      messageId: this.data.messageId,
      folder: this.data.folder
    }

    this.service.forwardEmail(data).subscribe((res: any) => {
      if (res.success) {
        this.alert.showAlert('email_forwarded');
        this.dialog.closeAll();
      } else {
        this.loading = false;
      }
    }, _ => this.loading = false)
  }

  reply() {
    if (this.toText) this.assignees.push(...this.toText.split(' '))
    if (this.ccText) this.ccAssignees.push(...this.ccText.split(' '))

    const data = {
      htmlText: this.form.value.htmlBody,
      to: this.assignees,
      cc: this.ccAssignees,
      attachments: this.attachments,
      messageId: this.data.messageId,
      folder: this.data.folder
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

  getAssignees($event: any) {
    this.assignees = $event.map((assignee: any) => assignee.email)
  }


  getCC($event: any) {
    this.ccAssignees = $event.map((assignee: any) => assignee.email)
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

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '100px',
    minHeight: '5rem',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    customClasses: [
      {
        name: 'Quote',
        class: 'quoteClass',
      },
      {
        name: 'Title Heading',
        class: 'titleHead',
        tag: 'h1',
      },
    ],
  };

  get f() {
    return this.form.controls;
  }
}
