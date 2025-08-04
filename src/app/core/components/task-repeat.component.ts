import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TaskDetails} from "../interfaces/task-details";
import {TaskDetailsService} from "../services/task-details.service";
import {AlertService} from "../services/alert.service";
import {TranslateModule} from "@ngx-translate/core";
import {DefineDaysPipe} from "../pipes/define-days.pipe";
import {ArabicNumbersPipe} from "../pipes/arabic-numbers.pipe";
import {ArabicDatePipe} from "../pipes/arabic-date.pipe";

@Component({
  selector: 'task-repeat',
  standalone: true,
  imports: [CommonModule, TranslateModule, DefineDaysPipe, ArabicNumbersPipe, ArabicDatePipe],
  template: `
      <div class="task-repeat flex rounded black" [ngClass]="{'aic' : details.stopedRepeat, 'aifs': !details.stopedRepeat}">
          <div class="img mr-1">
              <img src="../../../../../../../assets/images/icons/repeat.svg" alt="repeat" width="18">
          </div>
          <div class="start flex flex-wrap fs-14" *ngIf="!details.stopedRepeat">
              <p>{{'repeat_message' | translate}}</p>
              <p class="fs-14 mx-50"
                 *ngIf="(!details.repeatedPeriodNumber || details.repeatedPeriodNumber == 1) && !details.repetitionSelectedDays">
                  <span *ngIf="details.taskRepeatedPeriod == 1">{{'daily' | translate}}</span>
                  <span *ngIf="details.taskRepeatedPeriod == 2">{{'weekly' | translate}}</span>
                  <span *ngIf="details.taskRepeatedPeriod == 3">{{'monthly' | translate}}</span>
                  <span *ngIf="details.taskRepeatedPeriod == 4">{{'yearly' | translate}}</span>
              </p>
              <p class="mx-50" *ngIf="details.repeatedPeriodNumber > 1 && (!details.repetitionSelectedDays || details.repetitionSelectedDays.length == 0)">
                  <span>{{'every' | translate}}</span>
                  <span class="ml-50 mr-50" *ngIf="(details.repeatedPeriodNumber > 2 && lang == 'ar') || lang == 'en'">{{details.repeatedPeriodNumber | arabicNumbers}}</span>
                  <span *ngIf="details.taskRepeatedPeriod == 1">{{(details.repeatedPeriodNumber | defineDays) + '_day' | translate}}</span>
                  <span *ngIf="details.taskRepeatedPeriod == 2">{{(details.repeatedPeriodNumber | defineDays) + '_week' | translate}}</span>
                  <span *ngIf="details.taskRepeatedPeriod == 3">{{(details.repeatedPeriodNumber | defineDays) + '_month' | translate}}</span>
                  <span *ngIf="details.taskRepeatedPeriod == 4">{{(details.repeatedPeriodNumber | defineDays) + '_year' | translate}}</span>
              </p>
              <div class="ml-50 flex aic" *ngIf="details.repetitionSelectedDays && details.repetitionSelectedDays.length > 0">
                  <p class="mr-50">{{'every' | translate}}</p>
                  <ng-container *ngFor="let day of details.repetitionSelectedDays; let i = index">
                      <p *ngIf="day == 0">
                          <span>{{'sunday' | translate}}</span>
                      </p>
                      <p *ngIf="day == 1">
                          <span>{{'monday' | translate}}</span>
                      </p>
                      <p *ngIf="day == 2">
                          <span>{{'tuesday' | translate}}</span>
                      </p>
                      <p *ngIf="day == 3">
                          <span>{{'wednesday' | translate}}</span>
                      </p>
                      <p *ngIf="day == 4">
                          <span>{{'thursday' | translate}}</span>
                      </p>
                      <p *ngIf="day == 5">
                          <span>{{'friday' | translate}}</span>
                      </p>
                      <p *ngIf="day == 6">
                          <span>{{'saturday' | translate}}</span>
                      </p>
                      <p *ngIf="i != details.repetitionSelectedDays.length - 1 && i != details.repetitionSelectedDays.length - 2">,
                          &nbsp;</p>
                      <p *ngIf="i == details.repetitionSelectedDays.length - 2" class="ml-50">{{'and' | translate}} &nbsp;</p>
                  </ng-container>
              </div>
              <p class="mr-1" [ngClass]="{'ml-50': details.repetitionSelectedDays && details.repetitionSelectedDays.length > 0}">
                  {{'until' | translate}} {{details.endTimeForRepeat | arabicDate}}
              </p>
              <button class="end underline line-height bold fs-15 clickable-btn" *ngIf="creator" (click)="stopRepeat()">
                  {{'stop_repeat' | translate}}
              </button>
          </div>
          <div class="flex" *ngIf="details.stopedRepeat">
              <p>{{'repetition_stopped' | translate}}</p>
              <p class="ml-50 mr-50">
                  <span *ngIf="details.taskStopedRepeated == 3">{{'automatically' | translate}}</span>
                  <span *ngIf="details.taskStopedRepeated == 2">{{'manually' | translate}}</span>
              </p>
              <p *ngIf="details.taskStopedRepeated == 3"><span class="mr-25">{{'in' | translate}}</span> {{details.endTimeForRepeat | arabicDate}}</p>
              <p *ngIf="details.taskStopedRepeated == 2"><span class="mr-25">{{'in' | translate}}</span> {{details.stopedRepeatDate | arabicDate}}</p>
          </div>
      </div>

  `,
  styles: [`
    .task-repeat {
      background: #FBF1F1;
      padding: 1.5rem 2rem;

      .underline {
        text-decoration: underline;
        color: #8361CC;
      }
    }
  `]
})
export class TaskRepeatComponent {
  @Input() details!: any;
  lang = localStorage.getItem('language') || 'en';
  creator = false

  constructor(private service: TaskDetailsService, private alert: AlertService) {

  }

  ngOnInit(): void {
    console.log('this.details',this.details);
    if(this.details && this.details.taskGroupCreatorId == localStorage.getItem('id') ){
      this.creator = true
    }
  }

  stopRepeat() {
    this.service.stopRepeat({id: this.details.parentTaskGroupId || this.details.taskGroupId}).subscribe((res: any) => {
      if (res.success) {
        this.service.hasChanged.next(true);
        this.alert.showAlert('task_updated');
      }
    })
  }
}
