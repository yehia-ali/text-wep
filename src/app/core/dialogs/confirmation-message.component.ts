import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'confirmation-message',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="confirmation-message">
      <h4 class="text-center fs-17 pt-50 pb-1 px-2">
        {{data.message | translate}}
      </h4>
      <div mat-dialog-actions class="mt-50">
        <div class="flex aic w-100 gap-x-1">
          <button [mat-dialog-close]="false" mat-raised-button class="flex-auto w-100 dark-color clickable-btn rounded cancel-btn">{{'cancel' | translate}}</button>
          <button class="flex-auto rounded w-100 {{data.classes}}" mat-raised-button [mat-dialog-close]="true">{{data.btn_name | translate}}</button>
        </div>
      </div>
    </div>

  `,
  styles: []
})
export class ConfirmationMessageComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {

  }
}
