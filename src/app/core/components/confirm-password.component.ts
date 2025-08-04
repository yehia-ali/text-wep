import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {InputLabelComponent} from "../inputs/input-label.component";
import {InputPasswordComponent} from "../inputs/input-password.component";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'confirm-password',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule, InputLabelComponent, InputPasswordComponent, FormsModule, MatButtonModule],
  template: `
      <div class="confirmation-message" dir="auto">
          <h2>{{ 'delete_account' | translate }}</h2>
          <div mat-dialog-content>
              <p class="fs-17 pt-50 pb-1">
                  {{ 'delete_account_message' | translate }}
              </p>
              <div class="password">
                  <input-label key="password"></input-label>
                  <input-password (getType)="passwordType = $event">
                      <input [type]="passwordType" class="input" [(ngModel)]="password">
                  </input-password>
              </div>
          </div>
          <div mat-dialog-actions class="mt-50">
              <div class="flex aic w-100 mb-1 gap-x-1">
                  <button mat-dialog-close="" mat-raised-button class="flex-auto w-100 dark-color clickable-btn rounded cancel-btn">{{ 'cancel' | translate }}</button>
                  <button class="flex-auto rounded w-100 bg-danger white" mat-raised-button [mat-dialog-close]="password">{{ 'confirm' | translate }}</button>
              </div>
          </div>
      </div>

  `,
  styles: [
  ]
})
export class ConfirmPasswordComponent {
  passwordType: string = 'password';
  password: any = '';

}
