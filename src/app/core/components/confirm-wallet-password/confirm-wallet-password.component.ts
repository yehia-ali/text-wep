import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {WalletService} from '../../services/wallet.service';
import {Router} from "@angular/router";
import {InputLabelComponent} from "../../inputs/input-label.component";
import {InputErrorComponent} from "../../inputs/input-error.component";
import { AppointmentService } from '../../services/appointment.service';
import {SuccessMessageComponent} from "../success-message/success-message.component";

@Component({
  selector: 'confirm-wallet-password',
  standalone: true,
  template: `
      <div class="confirm-wallet-password" dir="auto">
          <h3>{{'confirm_password' | translate}}</h3>
          <div mat-dialog-content>
              <form [formGroup]="form">
                  <input-label key='password' [control]="form.controls['password']"/>
                  <input type="password" class="input" formControlName="password"/>
                  <input-error [control]="form.controls['password']"/>
              </form>
          </div>
          <div mat-dialog-actions align="end">
              <button mat-raised-button color="primary" [disabled]="btnDisabled" (click)="submit()" class="px-3">{{'next' | translate}}</button>
              <button mat-raised-button mat-dialog-close="" class="shadow-0 border border-dark px-2 ml-1">{{'cancel' | translate}}</button>
          </div>
      </div>
  `,
  styles: [],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputErrorComponent, MatDialogModule, TranslateModule, MatButtonModule, InputLabelComponent, InputErrorComponent]
})
export class ConfirmWalletPasswordComponent {

  form: FormGroup;
  btnDisabled = false;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private fb: FormBuilder, private walletSer: WalletService, private appointmentSer: AppointmentService, private dialog: MatDialog, private router: Router) {
    this.form = this.fb.group({
      password: ['', Validators.required]
    });
  }

  submit() {
    this.btnDisabled = true;
    this.walletSer.confirmPassword(this.form.controls['password'].value).subscribe((res: any) => {
      if (res.success) {
        if (this.data.type == 'confirm_booking') {
          this.appointmentSer.confirmAppointment(this.data.id).subscribe((res: any) => {
            if (!res.success) {
              this.btnDisabled = false;
            }
          })
        } else if (this.data.type == 'confirm_transfer') {
          this.walletSer.SendMoney(this.data.data).subscribe((res: any) => {
            if (res.success) {
              this.walletSer.hasChanged.next(true);
              this.walletSer.balanceChanged.next(true);
              this.dialog.open(SuccessMessageComponent, {
                disableClose: true,
                panelClass: 'success-dialog',
                data: {
                  data: res.data,
                  message: 'transfer_success'
                }
              });
            }
          });
        } else if (this.data.type == 'access_wallet') {
          if (this.walletSer.hasWalletAccount.value) {
            this.walletSer.walletPassword.next(true);
            this.router.navigate(['/wallet']).then(() => {
              this.walletSer.walletPassword.next(false);
              this.dialog.closeAll();
            })
          } else {
            this.walletSer.hasAccount().subscribe()
          }
        }
      } else {
        this.btnDisabled = false;
      }
    })
  }
}
