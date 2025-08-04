import { Component, Input } from '@angular/core';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from "@danielmoncada/angular-datetime-picker";
@Component({
  selector: 'task-date-range',
  standalone:true,
  imports:[
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  template: `
  asdfasdpfiiasdfjipo
  <input [owlDateTime]="dt1" [selectMode]="'range'" [owlDateTimeTrigger]="dt1" [placeholder]="">
  <owl-date-time #dt1></owl-date-time>
  `,
  styles: [
    `
      input{
        width: 100%;
        height: 41px;
        border: 1px solid #e7e7e7;
        border-radius: 4px;
      }
    `
  ]
})
export class TaksDateRangeComponent {
  @Input() placeholder :any
}
