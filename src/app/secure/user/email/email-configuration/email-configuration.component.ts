import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LayoutComponent} from "../../../../core/components/layout.component";
import {InputLabelComponent} from "../../../../core/inputs/input-label.component";
import {InputErrorComponent} from "../../../../core/inputs/input-error.component";
import {TranslateModule} from "@ngx-translate/core";
import {MagicScrollDirective} from "../../../../core/directives/magic-scroll.directive";
import {SubmitButtonComponent} from "../../../../core/components/submit-button.component";
import {InputPasswordComponent} from "../../../../core/inputs/input-password.component";
import {EmailConfigurationService} from "../../../../core/services/email-configuration.service";
import {AlertService} from "../../../../core/services/alert.service";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationMessageComponent} from "../../../../core/dialogs/confirmation-message.component";
import {UserService} from "../../../../core/services/user.service";

@Component({
  selector: 'email-leaves-settings',
  standalone: true,
  imports: [CommonModule, LayoutComponent, ReactiveFormsModule, InputLabelComponent, InputErrorComponent, TranslateModule, MagicScrollDirective, SubmitButtonComponent, InputPasswordComponent],
  templateUrl: './email-configuration.component.html',
  styleUrls: ['./email-configuration.component.scss']
})
export class EmailConfigurationComponent implements OnInit {
  userSer = inject(UserService)
  form: FormGroup;
  loading = false;
  type = 'password';
  service = inject(EmailConfigurationService)
  alert = inject(AlertService)
  dialog = inject(MatDialog)
  hasConfig = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      imapPort: ['', Validators.required],
      imap: ['', Validators.required],
      stmpPort: ['', Validators.required],
      stmpServer: ['', Validators.required],
      email: ['', Validators.required],
      password: [''],
    });
  }

  ngOnInit() {
    this.service.GetConfig().subscribe((res: any) => {
      this.hasConfig = !!res.data.stmpPort;
      this.form.patchValue({
        ...res.data,
        password: ''
      });
    });
  }

  submit() {
    this.loading = true;
    if (this.form.valid) {
      this.service.MailConfig(this.form.value).subscribe((res: any) => {
        if (res.success) {
          this.alert.showAlert('email_config_updated');
          this.userSer.getMyProfile().subscribe(res => {
            this.hasConfig = res.data.isMailConfigured;
          })
        }
        this.loading = false;
      });
    }
  }

  deleteConfiguration() {
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      data: {
        btn_name: 'confirm',
        classes: 'bg-danger white',
        message: 'delete_email_config'
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteConfig().subscribe((res: any) => {
          if (res.success) {
            this.alert.showAlert('email_config_deleted');
            this.userSer.getMyProfile().subscribe(res => {
              this.hasConfig = res.data.isMailConfigured;
            })
            this.form.reset();
          }
        });
      }
    });
  }

  get f() {
    return this.form.controls;
  }
}
