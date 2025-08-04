import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {ArabicNumbersPipe} from "../../pipes/arabic-numbers/arabic-numbers.pipe";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {SessionDetailsService} from "../../services/session-details.service";
import {NgxStarRatingModule} from "ngx-star-rating";
import {AlertService} from "../../services/alert.service";

@Component({
  selector: 'rate-form',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, ArabicNumbersPipe, MatDialogModule, MatButtonModule, NgxStarRatingModule],
  template: `
    <div class="add-rate dir p-3">
      <h2 class="black text-center">{{'whats_your_rate' | translate}}</h2>

      <div class="flex-center mt-1">
        <ngx-star-rating (change)="ratedFun()" [(ngModel)]="rate" id="rate"></ngx-star-rating>
      </div>

      <p class="mb-2 text-center fs-14" *ngIf="rated">{{'average_rate' | translate}} {{rate | arabicNumbers}}</p>

      <div class="reason" *ngIf="rated && rate < 3">
        <label>{{'rate_reason' | translate}}</label>
        <textarea class="input mb-1" rows="3" [(ngModel)]="rateReason"></textarea>
      </div>

      <div class="mt-50">
        <div class="flex aic gap-x-2 w-100">
          <button mat-dialog-close="" mat-raised-button class="flex-50 w-100 dark-color rounded cancel-btn">{{'cancel' | translate}}</button>
          <button mat-raised-button color="primary" class="flex-50 w-100 rounded" [disabled]="!rate || (rateReason.length < 1 && rate < 3)" (click)="submit()">{{'save' | translate}}</button>
        </div>
      </div>
    </div>

  `,
  styles: []
})
export class RateFormComponent {
  rated = false;
  rate = 0;
  rateReason = ''


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private service: SessionDetailsService, private dialog: MatDialog, private alert: AlertService) {
  }

  ratedFun() {
    this.rated = true;
    this.rateReason = ''
  }

  submit() {
    const data = {
      sessionAttendeeId: this.data.session.id,
      rateReason: this.rateReason,
      rateValue: this.rate
    }
    this.service.rateSession(data).subscribe((res: any) => {
      if (res.success) {
        this.dialog.closeAll();
        this.service.hasChanged.next(true);
        this.alert.showAlert('rate_updated')
      }
    });
  }
}
