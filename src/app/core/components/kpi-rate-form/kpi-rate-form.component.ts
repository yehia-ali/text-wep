import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { AlertService } from '../../services/alert.service';
import { ArabicNumbersPipe } from '../../pipes/arabic-numbers.pipe';
import { InputLabelComponent } from '../../inputs/input-label.component';
import { KpisService } from '../../services/kpis.service';

@Component({
  selector: 'kpi-rate-form',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    ArabicNumbersPipe,
    NgxStarRatingModule,
    InputLabelComponent,
  ],
  template: `
    <div class="add-rate dir">
      <h2 class="black text-center">{{ 'whats_your_rate' | translate }}</h2>

      <div class="target text-center pt-2 flex aic jcc">
        <div class="bg-gray py-75 px-2 w-19r rounded">
          <div class="fs-18">{{ 'target' | translate }}</div>
          <div class="fs-22 bold primary" style="margin-top: -5px;">
            {{ data.target | arabicNumbers }}
          </div>
        </div>
      </div>
      <div mat-dialog-content>
        <ng-container *ngIf="data.valueType.id == 4"> <!--4 = Score-->
          <div class="flex-center mt-1" >
            <ngx-star-rating
              (change)="ratedFun()"
              [(ngModel)]="achieved"
              id="rate"
            ></ngx-star-rating>
          </div>
          <p class="mb-2 text-center fs-14" *ngIf="achieved">
            {{ 'average_rate' | translate }} {{ achieved | arabicNumbers }}
          </p>
        </ng-container>

        <div class="mb-2" *ngIf="data.valueType.id != 4">
          <input-label key="achieved" />
          <input type="number" class="input" [(ngModel)]="achieved" min="1" />
        </div>

        <div class="reason">
          <input-label key="comment" />
          <textarea
            class="input mb-1"
            rows="3"
            [(ngModel)]="rateReason"
          ></textarea>
        </div>
      </div>

      <div class="mt-50" mat-dialog-actions>
        <div class="flex aic gap-x-2 w-100">
          <button
            mat-dialog-close=""
            mat-raised-button
            class="flex-50 w-100 dark-color rounded cancel-btn"
          >
            {{ 'cancel' | translate }}
          </button>
          <button
            mat-raised-button
            color="primary"
            class="flex-50 w-100 rounded"
            [disabled]="rateReason.length < 1 && achieved < 1"
            (click)="submit()">
            {{ 'save' | translate }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class KpiRateFormComponent {
  rated = false;
  rate = 0;
  rateReason = '';
  achieved: any = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: KpisService,
    private alert: AlertService,
    private dialogRef: MatDialogRef<KpiRateFormComponent>,
  ) {
    console.log(this.data);
  }

  ratedFun() {
    this.rated = true;
    this.rateReason = '';
  }

  submit() {
    let data: any;
      data = {
        kpiEmployeeId: this.data.id,
        comment: this.rateReason,
        value: this.achieved,
      };
      this.service.evaluateKpis(data).subscribe((res: any) => {
        this.dialogRef.close(true);
        this.alert.showAlert('success');
      });
  }
}
