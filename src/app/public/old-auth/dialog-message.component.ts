import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {RegisterService} from "../../core/services/register.service";
import {environment} from "../../../environments/environment";
import {callMobileFunction} from "../../core/functions/mobile-handle";
import {LoginService} from "../../core/services/login.service";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'dialog-message',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="dialog-message w-100 pt-2">
      <div class="flex-center w-100">
        <div class="bg-primary white rounded-50 message-type flex-center" *ngIf="data.type == 'success'">
          <i class='bx bx-check fs-50'></i>
        </div>
        <div class="bg-danger white rounded-50 message-type flex-center" *ngIf="data.type == 'error'">
          <i class='bx bx-x fs-50'></i>
        </div>
      </div>
      <p class="fs-35 mt-75 text-center" [ngClass]="{'primary': data.type == 'success', 'danger': data.type == 'error'}">
        {{ data.type | translate }}
      </p>
      <p class="fs-18 text-center px-1">{{ data.message | translate }}</p>
      <div mat-dialog-actions>
        <div class="flex-center mb-1 gap-x-1 w-100 mt-1">
          <button mat-raised-button class="flex-50" [ngClass]="{'bg-gray': data.type == 'error', 'bg-primary white': data.type == 'success'}" mat-dialog-close="" (click)="login()"
                  *ngIf="!data?.btn_message">{{ 'okay' | translate }}
          </button>
          <button mat-raised-button class="flex-50 bg-danger" *ngIf="data.type == 'error'" (click)="payment()">{{ 'try_again' | translate }}</button>
          <button mat-raised-button [ngClass]="{'bg-gray': data.type == 'error', 'bg-primary white': data.type == 'success'}" mat-dialog-close="" (click)="loginWithData()"
                  *ngIf="data?.btn_message">{{ 'new_login_btn' | translate }}
          </button>

        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DialogMessageComponent {

  userData!: any

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private registerSer: RegisterService, private loginSer: LoginService) {
  }

  ngOnInit(): void {
    this.registerSer.firstLoginData.subscribe(res => {
      this.userData = res
    })
    if (this.data.type == 'success') {
      localStorage.removeItem('p-token');
    }
  }

  payment() {
    let url = sessionStorage.getItem('paymentUrl')!;
    window.open(`${url}`, '_self');
  }

  login() {
    localStorage.removeItem('p-token');
    callMobileFunction()
    this.router.navigate(['/auth/login'])
  }

  loginWithData() {
    localStorage.removeItem('p-token');
    callMobileFunction()
    this.loginSer.login(this.userData).subscribe()
  }

}
