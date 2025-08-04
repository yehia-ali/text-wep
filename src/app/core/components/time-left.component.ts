import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {ArabicNumbersPipe} from "../pipes/arabic-numbers.pipe";
import {DefineDaysPipe} from "../pipes/define-days.pipe";

@Component({
  selector: 'time-left',
  standalone: true,
  imports: [CommonModule, TranslateModule, ArabicNumbersPipe, DefineDaysPipe],
  template: `
    <ng-container *ngIf="timeLeft">
      <div class="flex aic {{classes}}">
        <div class="bullet {{bullet}} rounded-50 mr-75"></div>
        <span *ngIf="lang == 'ar' && showLeft" class="mr-50">{{'left' | translate}}</span>
        <span class="mr-50" *ngIf="(timeLeft > 2 && lang == 'ar') || lang == 'en'">{{timeLeft | arabicNumbers}}</span>
        <span>{{(timeLeft | defineDays) + "_" + label | translate}}</span>
        <span *ngIf="lang == 'en' && showLeft" class="ml-50">{{'left' | translate}}</span>
      </div>
    </ng-container>
  `,
  styles: [`
    .bullet {
      width: 1rem;
      height: 1rem;
    }
  `]
})
export class TimeLeftComponent {
  @Input() timeLeft: any;
  @Input() label = '';
  @Input() classes = '';
  @Input() bullet = '';
  @Input() showLeft!: boolean
  lang = localStorage.getItem('language') || 'en';
}
