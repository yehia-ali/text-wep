import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArabicDatePipe} from "../../pipes/arabic-date.pipe";
import {ArabicNumbersPipe} from "../../pipes/arabic-numbers.pipe";
import {BidiModule} from "@angular/cdk/bidi";
import {InputErrorComponent} from "../../inputs/input-error.component";
import {InputLabelComponent} from "../../inputs/input-label.component";
import {MatButtonModule} from "@angular/material/button";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {NgxFileDropModule} from "ngx-file-drop";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RecordComponent} from "../record/record.component";
import {TranslateModule} from "@ngx-translate/core";
import {UserProfile} from "../../interfaces/user-profile";
import {AlertService} from "../../services/alert.service";
import {UserService} from "../../services/user.service";
import {FilterLabelComponent} from "../../filters/filter-label.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {Observable} from "rxjs";

@Component({
  selector: 'report-problem',
  standalone: true,
  imports: [CommonModule, ArabicDatePipe, ArabicNumbersPipe, BidiModule, InputErrorComponent, InputLabelComponent, MatButtonModule, MatDialogModule, NgxFileDropModule, ReactiveFormsModule, RecordComponent, TranslateModule, FilterLabelComponent, NgSelectModule],
  templateUrl: './report-problem.component.html',
  styleUrls: ['./report-problem.component.scss']
})
export class ReportProblemComponent {
  userProfile: UserProfile = this.userProfileSer.user$.value;
  attachments: File[] = [];
  loading: boolean = false;
  form!: FormGroup;
  sound: any;
  categories$: Observable<any> = this.userProfileSer.getCategories()

  constructor(private userProfileSer: UserService, private fb: FormBuilder, private alert: AlertService, private dialog: MatDialog) {
    this.form = this.fb.group({
      subject: ['', Validators.required],
      message: ['', Validators.required],
      category: [null, Validators.required]
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
      formData.append('category', this.form.value.category);
      formData.append('message', this.form.value.message);
      if (this.sound) {
        formData.append('ticket[]', this.sound);
      }
      for (let i = 0; i < this.attachments.length; i++) {
        formData.append('ticket[]', this.attachments[i]);
      }
      if (this.attachments.length > 0 || this.sound) this.alert.showAlert('file_uploading', 'bg-primary', 800000000)
      this.userProfileSer.raiseIssue(formData).subscribe((res: any) => {
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

  get f() {
    return this.form.controls
  }

}
