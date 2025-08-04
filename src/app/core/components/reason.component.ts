import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BidiModule } from '@angular/cdk/bidi';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'reason-component',
  standalone: true,
  imports: [
    CommonModule,
    BidiModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    TranslateModule,
  ],
  template: `
    <div class="rejection-reason" dir="auto">
      <h3>{{ data.title | translate }}</h3>
      <div class="reason" mat-dialog-content>
        <label>{{ data.subTitle | translate }}</label>
        <textarea
          class="input"
          rows="4"
          [(ngModel)]="reason"
          maxlength="250"
          (keypress)="reasonLength()"
        ></textarea>
      </div>
      <div mat-dialog-actions>
        <div class="flex w-100">
          <button
            mat-raised-button
            mat-dialog-close=""
            class="flex-auto dark-color clickable-btn rounded cancel-btn"
          >
            {{ 'cancel' | translate }}
          </button>
          <button
            mat-raised-button
            [mat-dialog-close]="reason"
            class="flex-auto rounded"
            [ngClass]="reason ? data.btnColor : ''"
            [disabled]="!reason"
          >
            {{ data.btnTitle | translate }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ReasonComponent {
  reason = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any ,private alert :AlertService  ) {}
  reasonLength() {
    if (this.reason.length == 250) {
      this.alert.showAlert('max_length_250', 'bg-danger');
    }
  }
}
