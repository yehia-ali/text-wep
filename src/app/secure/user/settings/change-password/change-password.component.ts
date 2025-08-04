import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputLabelComponent} from "../../../../core/inputs/input-label.component";
import {SubmitButtonComponent} from "../../../../core/components/submit-button.component";
import {InputPasswordComponent} from "../../../../core/inputs/input-password.component";
import {InputErrorComponent} from "../../../../core/inputs/input-error.component";
import {AlertService} from "../../../../core/services/alert.service";
import {PasswordsMatch} from "../../../../core/validators/passwords-match";
import {UserService} from "../../../../core/services/user.service";
import {LayoutComponent} from "../../../../core/components/layout.component";
import {MagicScrollDirective} from "../../../../core/directives/magic-scroll.directive";
import { MatDialog } from '@angular/material/dialog';
import { ConfirmChangePasswordComponent } from 'src/app/core/components/confirm-change-password.component';
import { Router } from '@angular/router';

@Component({
  selector: 'change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputLabelComponent, SubmitButtonComponent, InputPasswordComponent, InputErrorComponent, LayoutComponent, MagicScrollDirective],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  form: FormGroup;
  loading = false;
  type1 = 'password';
  type2 = 'password';
  type3 = 'password';

  constructor(private service: UserService, private fb: FormBuilder, private alertSer: AlertService , private dialog: MatDialog , private router:Router) {
    this.form = this.fb.group({
      currentPassword: ["", Validators.required],
      newPassword: ["", [Validators.required, Validators.minLength(6)]],
      newPasswordTwo: ["", [Validators.required, Validators.minLength(6)]],
    }, {validator: PasswordsMatch})
  }
  deleteAccount() {

  }
  submit() {

    if (this.form.valid) {
      let dialogRef = this.dialog.open(ConfirmChangePasswordComponent, {
        panelClass: 'confirm-password-dialog',
      })

      dialogRef.afterClosed().subscribe(res => {
      this.loading = true;
        if (res) {
          const data = {
            currentPassword: this.form.value.currentPassword,
            newPassword: this.form.value.newPassword,
          }
          this.service.changePassword(data).subscribe((res: any) => {
            if (res.success) {
              this.form.reset();
              this.alertSer.showAlert('password_changed', 'bg-success');
              localStorage.clear()
              localStorage.setItem('language', 'ar');
              localStorage.setItem('mode', 'light');
              this.router.navigate(['/auth'])
              // window.location.reload()
            }
            this.loading = false;
          })
        }
      })
    } else {
      this.form.markAllAsTouched();
    }
  }

  get f() {
    return this.form.controls;
  }
}
