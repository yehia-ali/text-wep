import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";
import {SessionDetailsService} from "../../services/session-details.service";
import {SessionDetails} from "../../interfaces/session-details";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgxFileDropModule} from "ngx-file-drop";
import {AlertService} from "../../services/alert.service";
import {ArabicDatePipe} from "../../pipes/arabic-date.pipe";
import {UserProfile} from "../../interfaces/user-profile";
import { PublicUserProfileService } from '../../services/public-user-profile.service';
import {InputLabelComponent} from "../../inputs/input-label.component";
import {InputErrorComponent} from "../../inputs/input-error.component";
import {ArabicNumbersPipe} from "../../pipes/arabic-numbers.pipe";
import {RecordComponent} from "../record/record.component";

@Component({
  selector: 'raise-issue',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule, MatButtonModule, FormsModule, NgxFileDropModule, ReactiveFormsModule, InputLabelComponent, InputErrorComponent, ArabicDatePipe, ArabicNumbersPipe, RecordComponent],
  templateUrl: './raise-issue.component.html',
  styleUrls: ['./raise-issue.component.scss'],
  providers: [ArabicDatePipe]
})
export class RaiseIssueComponent {
  session: SessionDetails;
  userProfile: UserProfile = this.userProfileSer.userProfile();
  attachments: File[] = [];
  loading: boolean = false;
  form: FormGroup;
  sound: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private service: SessionDetailsService, private userProfileSer: PublicUserProfileService, private arabicDate: ArabicDatePipe, private fb: FormBuilder, private alert: AlertService, private dialog: MatDialog, private translate: TranslateService) {
    this.session = this.data.session;
    this.form = this.fb.group({
      subject: ['', Validators.required],
    })
  }

  send() {
    if (this.form.valid) {
      this.loading = true;
      let formData = new FormData();
      formData.append('username', this.userProfile.name);
      formData.append('email', this.userProfile.email);
      formData.append('phone', this.userProfile.phoneNumber);
      formData.append('subject', this.form.value.subject);
      formData.append('category', '8');
      formData.append('message', `
       ${this.translate.instant('id')}: S-${this.session.id} <br/>
       ${this.translate.instant('title')}: ${this.session.title}<br/>
       ${this.session.isConsultant ? this.translate.instant('attendee') : this.translate.instant('consultant')}: ${this.session.isConsultant ? this.session.attendeeUserName : this.session.consulaltantUserName}<br/>
       ${this.translate.instant('session_date')}: ${this.arabicDate.transform(this.session.startDate)}<br/>
       ${this.translate.instant('session_cost')}: ${this.session.price} ${this.translate.instant('egp')}`);
      for (let i = 0; i < this.attachments.length; i++) {
        formData.append('ticket[]', this.attachments[i]);
      }
      if (this.sound) {
        formData.append('ticket[]', this.sound);
      }
      if (this.attachments.length > 0 || this.sound) {
        this.alert.showAlert('file_uploading', 'bg-primary', 800000000)
      }
      this.service.raiseIssue(formData).subscribe(
        (res: any) => {
          if (res.success) {
            this.dialog.closeAll()
            this.alert.showAlert('issue_sent')
          } else {
            this.loading = false;
          }
        })
    }
  }

  dropped($event: any) {
    for (const droppedFile of $event) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        this.attachments.push(file);
      });
    }
    if (this.attachments.length > 4) {
      this.attachments.length = 4;
    }
  }

  removeFile(i: number) {
    this.attachments.splice(i, 1);
  }
}
