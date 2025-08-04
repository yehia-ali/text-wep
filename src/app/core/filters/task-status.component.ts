import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {enumToArray} from "../functions/enum-to-array";
import {TaskStatus} from "../enums/task-status";
import {FilterLabelComponent} from "./filter-label.component";

@Component({
  selector: 'task-status',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule, TranslateModule, FilterLabelComponent],
  template: `
      <div class="status {{ newFilter ? 'new-filter' : '' }}">
          <filter-label *ngIf="!hideLabel" key="status" ></filter-label>
          <ng-select  [placeholder]="placeholder | translate" (ngModelChange)="changeValue($event)" [(ngModel)]="selectedValue" [clearSearchOnAdd]="true" [closeOnSelect]="false"
                     [items]="list"
                     [multiple]="true" appendTo="body" bindLabel="name" bindValue="value" class="{{width}} {{classes}}">
              <ng-template let-clear="clear" let-items="items" ng-multi-label-tmp>
                  <div class="ng-value flex aic">
                    <span class="ng-value-label">
                      <span class="flex aic fs-11">
                        <span *ngIf="items[0].name.length >= 10">{{items[0].name  | slice:0:10}}...</span>
                        <span *ngIf="items[0].name.length < 10">{{items[0].name }}</span>
                      </span>
                    </span>
                    <span (click)="clear(items[0])" aria-hidden="true" class="ng-value-icon right">×</span>
                  </div>
                  <div *ngIf="items.length > 1" class="ng-value rounded-2">
                      <span class="ng-value-label fs-11">{{items.length - 1}} {{'more' | translate}}...</span>
                  </div>
              </ng-template>
          </ng-select>
          <span
        class="rounded-5 bg-primary count flex aic jcc fs-11 simibold white ml-50"
        *ngIf="newFilter && selectedValue.length > 0"
      >
        {{ selectedValue.length }}
      </span>
      </div>

  `,
  styles: []
})
export class TaskStatusComponent {
  @Output() valueChanged = new EventEmitter();
  @Input() selectedValue: any[]|any = [];
  @Input() classes = '';
  @Input() placeholder = '';
  @Input() width = 'w-11r';
  @Input() newFilter = false;
  @Input() hideLabel = false;
  list = enumToArray(TaskStatus);

  changeValue($event: any) {
    this.valueChanged.emit($event);
  }
}
