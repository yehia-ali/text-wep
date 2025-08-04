import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {ArabicNumbersPipe} from "../pipes/arabic-numbers.pipe";
import {DefineDaysPipe} from "../pipes/define-days.pipe";

@Component({
  selector: 'task-overdue',
  standalone: true,
  imports: [CommonModule, TranslateModule, ArabicNumbersPipe, DefineDaysPipe],
  template: `
    <div *ngIf="endedTaskRepeatedCounter > 0">
      <div class="flex-center {{classes}}">
        <div class="bullet bg-danger px-50 pt-50 pb-50 rounded-50 mr-75"></div>
        <span class="mr-50"
              *ngIf="(lang == 'ar' && endedTaskRepeatedCounter > 2) || lang == 'en'">{{endedTaskRepeatedCounter | arabicNumbers}}</span>
        <span>{{(endedTaskRepeatedCounter | defineDays) + '_day' | translate}}</span>
      </div>
    </div>
  `,
  styles: []
})
export class TaskOverdueComponent {
  @Input() endedTaskRepeatedCounter!: number;
  @Input() classes!: string;
  lang = localStorage.getItem('language') || 'en';
}
