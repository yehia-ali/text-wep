import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../../../core/services/user.service";
import {AlertService} from "../../../core/services/alert.service";
import {TranslateModule} from "@ngx-translate/core";
import {LayoutComponent} from "../../../core/components/layout.component";
import {ConfirmPasswordComponent} from "../../../core/components/confirm-password.component";

@Component({
  selector: 'delete-account',
  standalone: true,
  imports: [CommonModule, MatButtonModule, TranslateModule, LayoutComponent],
  template: `
      <layout>
          <div class="delete-account h-100 flex-center">
              <button mat-raised-button color="warn" class="py-1 px-2 fs-18" (click)="deleteAccount()">{{ 'delete_your_account' | translate }}</button>
          </div>
      </layout>
  `,
  styles: []
})
export class DeleteAccountComponent {
  constructor(private dialog: MatDialog, private service: UserService, private alert: AlertService, private router: Router) {
  }

  deleteAccount() {
    let dialogRef = this.dialog.open(ConfirmPasswordComponent, {
      panelClass: 'confirm-password-dialog',
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.service.deleteAccount(res).subscribe(() => {
          let lang = localStorage.getItem('language') || 'en';
          let mode = localStorage.getItem('mode') || 'light';
          localStorage.clear()
          localStorage.setItem('language', lang);
          localStorage.setItem('mode', mode);
          this.alert.showAlert('account_deleted');
          this.router.navigate(['/auth/login'])
        })
      }
    })
  }
}
