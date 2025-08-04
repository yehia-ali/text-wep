import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilterLabelComponent} from "./filter-label.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {enumToArray} from "../functions/enum-to-array";
import {VoteStatus} from "../enums/vote-status";

@Component({
  selector: 'vote-status',
  standalone: true,
  imports: [CommonModule, FilterLabelComponent, NgSelectModule, TranslateModule, FormsModule],
  template: `
    <div class="status">
      <filter-label key="status"></filter-label>
      <ng-select (ngModelChange)="changeValue($event)" [(ngModel)]="selectedValue" [clearSearchOnAdd]="true" [closeOnSelect]="false"
                 [items]="list"
                 [multiple]="true" appendTo="body" bindLabel="name" bindValue="value" class="w-22r {{classes}}">
        <ng-template let-clear="clear" let-items="items" ng-multi-label-tmp>
          <div class="ng-value flex aic">
                    <span class="ng-value-label">
                      <span class="flex aic fs-11">
                        <span *ngIf="items[0].name.length >= 10">{{ items[0].name  | slice:0:10 }}...</span>
                        <span *ngIf="items[0].name.length < 10">{{ items[0].name }}</span>
                      </span>
                    </span>
            <span (click)="clear(items[0])" aria-hidden="true" class="ng-value-icon right">×</span>
          </div>
          <div *ngIf="items.length > 1" class="ng-value rounded-2">
            <span class="ng-value-label fs-11">{{ items.length - 1 }} {{ 'more' | translate }}...</span>
          </div>
        </ng-template>
      </ng-select>
    </div>
  `,
  styles: []
})
export class VoteStatusComponent {
  @Output() valueChanged = new EventEmitter();
  @Input() selectedValue!: [];
  @Input() classes = '';
  list = enumToArray(VoteStatus);

  changeValue($event: any) {
    this.valueChanged.emit($event);
  }
}
