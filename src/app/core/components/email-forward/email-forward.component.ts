import {Component, inject, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BidiModule} from "@angular/cdk/bidi";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputLabelComponent} from "../../inputs/input-label.component";
import {SelectUserComponent} from "../select-user.component";
import {SendEmailService} from "../../services/send-email.service";
import {AlertService} from "../../services/alert.service";
import {MatButtonModule} from "@angular/material/button";
import {SubmitButtonComponent} from "../submit-button.component";

@Component({
  selector: 'email-forward',
  standalone: true,
  imports: [CommonModule, BidiModule, MatDialogModule, TranslateModule, ReactiveFormsModule, InputLabelComponent, SelectUserComponent, MatButtonModule, SubmitButtonComponent],
  templateUrl: './email-forward.component.html',
  styleUrls: ['./email-forward.component.scss']
})
export class EmailForwardComponent {
  service = inject(SendEmailService);
  alert = inject(AlertService)
  dialog = inject(MatDialog)
  loading = false;
  ccAssignees = []
  assignees = ''

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }

  submit() {
    this.loading = true;
    if (this.assignees.length > 0) {
      const data = {
        toEmail: this.assignees,
        cc: this.ccAssignees,
        messageId: this.data.messageId
      }
      this.service.forwardEmail(data).subscribe((res: any) => {
        if (res.success) {
          this.alert.showAlert('');
          this.dialog.closeAll();
        } else {
          this.loading = false;
        }
      }, _ => this.loading = false)
    }
  }

  getAssignees($event: any) {
    this.assignees = $event.map((assignee: any) => assignee.email)
  }


  getCC($event: any) {
    this.ccAssignees = $event.map((assignee: any) => assignee.email)
  }

}
