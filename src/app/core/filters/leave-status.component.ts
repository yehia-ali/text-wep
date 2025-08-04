import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FilterLabelComponent} from "./filter-label.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {enumToArray} from "../functions/enum-to-array";
import {VoteStatus} from "../enums/vote-status";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'leave-status',
  standalone: true,
  imports: [CommonModule, FilterLabelComponent, NgSelectModule, TranslateModule, FormsModule],
  template: `
    <div class="status">
      <filter-label key="status"></filter-label>
      <ng-select (ngModelChange)="changeValue($event)" [(ngModel)]="selectedValue" [closeOnSelect]="true" [items]="items" [multiple]="false" appendTo="body" bindLabel="name" bindValue="value" class="w-22r {{classes}}">

      </ng-select>
    </div>
  `,
  styles: [
  ]
})
export class LeaveStatusComponent {
  @Output() valueChanged = new EventEmitter();
  @Input() selectedValue!: [];
  @Input() classes = '';
  items :any[] = [
    {name: this.translateSer.instant('pending'), value: 0},
    {name: this.translateSer.instant('approved'), value: 1},
    {name: this.translateSer.instant('rejected'), value: 2},
    // {name: this.translateSer.instant('canceled'), value: 3},
  ]
  changeValue($event: any) {
    this.valueChanged.emit($event);
  }


  constructor(private translateSer: TranslateService) {

  }
}
