import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'repetition',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <ng-container *ngIf="!isRepeated">
      -
    </ng-container>

    <ng-container *ngIf="isRepeated">
      <div class="flex aic jcc">
        <div class="img mr-75">
          <img alt="repeat" src="assets/images/icons/repeat.svg">
        </div>
        <p class="fs-14">
          <span *ngIf="repeatedPeriod == 1">{{'daily' | translate}}</span>
          <span *ngIf="repeatedPeriod == 2">{{'weekly' | translate}}</span>
          <span *ngIf="repeatedPeriod == 3">{{'monthly' | translate}}</span>
          <span *ngIf="repeatedPeriod == 4">{{'yearly' | translate}}</span>
        </p>
      </div>
    </ng-container>

  `,
  styles: [
  ]
})
export class RepetitionComponent {
  @Input() isRepeated!: any;
  @Input() repeatedPeriod!: any;

}
