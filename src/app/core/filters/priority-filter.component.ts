import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { enumToArray } from '../functions/enum-to-array';
import { Priority } from '../enums/priority';
import { FilterLabelComponent } from './filter-label.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'priority-filter',
  standalone: true,
  imports: [
    CommonModule,
    FilterLabelComponent,
    NgSelectModule,
    FormsModule,
    TranslateModule,
  ],
  template: `
    <div class=" {{ newFilter ? 'new-filter' : '' }}">
      <filter-label *ngIf="!hideLabel" [key]="'priority'" />
      <div>
        <ng-select
        [placeholder]="placeholder | translate"
          (ngModelChange)="changeValue($event)"
          [(ngModel)]="selectedValue"
          [clearSearchOnAdd]="true"
          [closeOnSelect]="multi ? false : true"
          [items]="list"
          [multiple]="multi"
          appendTo="body"
          bindLabel="name"
          bindValue="value"
          class="w-11r  {{ classes }}"
        >
          <ng-template
            let-index="index"
            let-item="item"
            let-item$="item$"
            ng-option-tmp
          >
            <span>{{ item.name }}</span>
          </ng-template>
          <ng-container *ngIf="!multi">
            <ng-template let-clear="clear" let-items="items" ng-multi-label-tmp>
              <div class="ng-value flex aic">
                <span class="ng-value-label">
                  <span class="flex aic fs-11">
                    <span *ngIf="items[0].name.length >= 10"
                      >{{ items[0].name | slice : 0 : 10 }}...</span
                    >
                    <span *ngIf="items[0].name.length < 10">{{
                      items[0].name
                    }}</span>
                  </span>
                </span>
                <span
                  (click)="clear(items[0])"
                  aria-hidden="true"
                  class="ng-value-icon right"
                  >×</span
                >
              </div>
              <div *ngIf="items.length > 1" class="ng-value rounded-2">
                <span class="ng-value-label fs-11"
                  >{{ items.length - 1 }} {{ 'more' | translate }}...</span
                >
              </div>
            </ng-template>
          </ng-container>
        </ng-select>
      </div>
      <span
        class="rounded-5 bg-primary count flex aic jcc fs-11 simibold white ml-50"
        *ngIf="newFilter && selectedValue.length > 0"
      >
        {{ selectedValue.length }}
      </span>
    </div>
  `,
  styles: [],
})
export class PriorityFilterComponent {
  @Output() valueChanged = new EventEmitter();
  @Input() selectedValue: any[] | any = [];
  @Input() classes = '';
  @Input() placeholder = '';
  @Input() multi = true;
  @Input() newFilter = false;
  @Input() clearData = false;
  @Input() hideLabel = false;

  list = enumToArray(Priority);

  changeValue($event: any) {
    this.valueChanged.emit($event);
  }
}
