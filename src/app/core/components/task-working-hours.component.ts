import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {ArabicNumbersPipe} from "../pipes/arabic-numbers.pipe";

@Component({
  selector: 'task-working-hours',
  standalone: true,
  imports: [CommonModule, TranslateModule, ArabicNumbersPipe],
  template: `
      <div class="new-card bg-gray p-1 rounded">
          <div class="total mb-1">
              <div class="bg-primary mb-2 mt-75" [ngStyle]="{'width': workingHours?.requiredPercentage + '%'}"></div>
              <div class="flex aic w-100 relative extra-hours">
                  <div class="bg-light-primary" [ngStyle]="{'width': workingHours?.actualPercentage + '%'}"></div>
                  <div class="bg-danger" *ngIf="workingHours?.extraHours || workingHours?.extraMinutes" [ngStyle]="{'width': workingHours?.extraTimePercentage + '%'}"></div>
                  <p class="line-height danger bold">
                      <span *ngIf="workingHours?.extraHours">{{workingHours?.extraHours}}</span>
                      <span *ngIf="workingHours?.extraMinutes && workingHours?.extraHours && !dashboard" class="mx-50">:</span>
                      <span *ngIf="workingHours?.extraMinutes && !dashboard">{{workingHours?.extraMinutes}}</span>
                  </p>
              </div>

          </div>
          <div class="flex jcsr aic w-100" *ngIf="workingHours">
              <div class="flex aic">
                  <p class="primary">{{'required_text' | translate}}</p>
                  <p class="bold ml-1">
                      <span>{{workingHours?.required}}</span>
                      <span *ngIf="workingHours?.requiredMinutes && workingHours?.requiredMinutes && !dashboard" class="mx-50">:</span>
                      <span *ngIf="workingHours?.requiredMinutes && !dashboard">{{workingHours?.requiredMinutes}}</span>
                  </p>
              </div>
              <div class="flex aic">
                  <p class="primary">{{'actual' | translate}}</p>
                  <p class="bold ml-1">
                      <span>{{workingHours?.actual}}</span>
                      <span *ngIf="workingHours?.actualMinutes && !dashboard" class="mx-50">:</span>
                      <span *ngIf="workingHours?.actualMinutes && !dashboard">{{workingHours?.actualMinutes}}</span>
                  </p>
              </div>
          </div>
      </div>

  `,
  styles: [`
    .new-card {
      .total {
        border-radius: 5rem;

        & > div, .extra-hours > div {
          height: 4px;
        }
        .extra-hours p {
          position: absolute;
          top: 0;
          transform: translateY(-100%);
          inset-inline-end: 0;
        }
      }
    }

  `]
})
export class TaskWorkingHoursComponent {
  @Input() workingHours!: any;
  @Input() dashboard = true;

}
