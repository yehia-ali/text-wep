import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {NgxStarRatingModule} from "ngx-star-rating";
import {AlertService} from "../../services/alert.service";
import {ArabicNumbersPipe} from "../../pipes/arabic-numbers.pipe";
import {TaskDetailsService} from "../../services/task-details.service";
import {SessionDetailsService} from "../../services/session-details.service";
import { InputLabelComponent } from "../../inputs/input-label.component";

@Component({
  selector: 'rate-form',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, MatDialogModule, MatButtonModule, ArabicNumbersPipe, NgxStarRatingModule, InputLabelComponent],
  template: `
    <div class="add-rate dir">
      <h2 class="black text-center">{{'whats_your_rate' | translate}}</h2>

      <div class="target text-center pt-2 flex aic jcc" *ngIf="data.target && data.taskType == 6">
        <div class="bg-gray py-75 px-2 w-19r rounded">
          <div class="fs-18">{{'target' | translate}}</div>
          <div class="fs-22 bold primary" style="margin-top: -5px;">{{data.target | arabicNumbers}}</div>
        </div>
      </div>
      <div mat-dialog-content>
        <div class="flex-center mt-1">
          <ngx-star-rating (change)="ratedFun()" [(ngModel)]="rate" id="rate"></ngx-star-rating>
        </div>

        <p class="mb-2 text-center fs-14" *ngIf="rated">{{'average_rate' | translate}} {{rate | arabicNumbers}}</p>
        <div class="mb-2" *ngIf="data.target && data.taskType == 6">
          <input-label key="achieved"/>
          <input type="number" class="input" [(ngModel)]="achieved" min="1">
        </div>
        <div class="reason" *ngIf="rated && rate < 3 || data.taskType == 6">
          <input-label key="{{data.taskType == 6 ? 'comment' : 'rate_reason'}}"/>
          <textarea class="input mb-1" rows="3" [(ngModel)]="rateReason"></textarea>
        </div>
      </div>

      <div class="mt-50" mat-dialog-actions>
        <div class="flex aic gap-x-2 w-100">
          <button mat-dialog-close="" mat-raised-button class="flex-50 w-100 dark-color rounded cancel-btn">{{'cancel' | translate}}</button>
          <button mat-raised-button color="primary" class="flex-50 w-100 rounded" [disabled]="!rate || (rateReason.length < 1 && rate < 3) || (achieved < 1 && data.taskType == 6)" (click)="submit()">{{'save' | translate}}</button>
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
  achieved: any = 0;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private service: TaskDetailsService, private dialog: MatDialog, private alert: AlertService, private sessionService: SessionDetailsService) {
    console.log(this.data)
  }

  ratedFun() {
    this.rated = true;
    this.rateReason = ''
  }

  submit() {
    let data: any;
    if (this.data?.isSession) {
      data = {
        sessionAttendeeId: this.data.session.id,
        rateReason: this.rateReason,
        rateValue: this.rate
      }
      this.sessionService.rateSession(data).subscribe((res: any) => {
        this.dialog.closeAll();
        this.sessionService.hasChanged.next(true);
        this.alert.showAlert('session_updated')
      })
    } else {
      data = {
        id: this.data.id,
        rateReason: this.rateReason,
        rate: this.rate,
        achived: this.achieved,
      }
      this.service.addRate(data).subscribe((res: any) => {
        if (res.success) {
          this.dialog.closeAll();
          this.service.hasChanged.next(true);
          this.alert.showAlert('task_updated')
        }
      });
    }
  }
}
