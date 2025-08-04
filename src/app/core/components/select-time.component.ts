import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import { HrEmployeesService } from '../services/hr-employees.service';

@Component({
  selector: 'select-time',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
      <div class="select-time flex aic pt-25 w-100" [ngClass]="{'margin': withMargin}">
          <div class="days flex aic jcc mr-3" *ngIf="showDays">
              <div class="plus line-height pointer" (click)="addDay()"><i class='bx bx-plus-circle primary fs-20 mx-50'></i></div>
              <div class="time relative">
                  <div class="value flex-center">
                      <input [(ngModel)]="days" type="number" min="0" max="99" class="input" (ngModelChange)="calcTime()">
                  </div>
                </div>
                <div class="minus line-height pointer" (click)="minusDay()"><i class='bx bx-minus-circle primary fs-20 mx-50'></i></div>
                <div class="label">{{'days' | translate}}</div>
          </div>

          <div class="hours flex aic jcc mr-3">
              <div class="plus line-height pointer" (click)="addHour()"><i class='bx bx-plus-circle primary fs-20 mx-50'></i></div>
              <div class="time relative">
                  <div class="value flex-center">
                      <input [(ngModel)]="hours" type="number" min="0" max="99" class="input" (ngModelChange)="calcTime()">
                  </div>
                </div>
                <div class="minus line-height pointer" (click)="minusHour()"><i class='bx bx-minus-circle primary fs-20 mx-50'></i></div>
                <div class="label">{{'hours' | translate}}</div>
          </div>

          <div class="minutes flex aic jcc">
              <div class="plus line-height pointer" (click)="addMinute()"><i class='bx bx-plus-circle primary fs-20 mx-50'></i></div>
              <div class="time relative">
                  <div class="value flex-center">
                      <input [(ngModel)]="minutes" type="number" min="0" max="59" class="input" (ngModelChange)="calcTime()">
                  </div>
                </div>
                <div class="minus line-height pointer" (click)="minusMinutes()"><i class='bx bx-minus-circle primary fs-20 mx-50'></i></div>
                <div class="label">{{'minutes' | translate}}</div>
          </div>
      </div>
  `,
  styles: [`
  .input{
    height:25px;
    width:25px;
    padding:0;
  }
    .select-time.margin {
      margin-inline-start: 2.5rem;
    }

    input {
      width: 4rem;
      padding: 1.1rem 0 !important;
      text-align: center;
    }
  `]
})
export class SelectTimeComponent {
  @Input() hours: any = 0;
  @Input() minutes: any = 0;
  @Input() withMargin = true;
  @Output() calcMinutes = new EventEmitter();
  @Input() showDays = false;
  @Input() days: any = 0;
  shiftHours: number = 0;
  userId = localStorage.getItem('id');
  constructor(private service : HrEmployeesService) {
   setTimeout(() => {
    this.calcTime()
   }, 200);
   this.service.getUserShifts(this.userId).subscribe((res:any) => {
    this.shiftHours = res.data.requiredWorkingHoursDaily
   })
  }

  addDay() {
    if (this.days < 99) {
      this.days++
      this.calcTime();
    }
  }
  minusDay() {
    if (this.days > 0) {
      this.days--
      this.calcTime();
    }
  }
  addHour() {
    if (this.hours < 99) {
      this.hours++
      this.calcTime();
    }
  }

  minusHour() {
    if (this.hours > 0) {
      this.hours--
      this.calcTime();
    }
  }

  addMinute() {
    if (this.minutes < 59) {
      this.minutes++
      this.calcTime();
    }
  }

  minusMinutes() {
    if (this.minutes > 0) {
      this.minutes--
      this.calcTime();
    }
  }

  calcTime() {
    let sum = ((parseInt(this.days) * this.shiftHours) * 60) + (parseInt(this.hours) * 60) + parseInt(this.minutes);
    if (sum) {
      this.calcMinutes.emit(sum);
      console.log(sum);

    } else {
      this.calcMinutes.emit(null);
    }
  }
}
