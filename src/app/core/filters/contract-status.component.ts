import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FilterLabelComponent} from "./filter-label.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslateModule} from "@ngx-translate/core";
import {enumToArray} from "../functions/enum-to-array";
import {EmploymentStatus} from "../enums/employment-status";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'contract-status',
  standalone: true,
  imports: [CommonModule, FilterLabelComponent, NgSelectModule, TranslateModule, FormsModule],
  template: `
    <div class="contract-status">
      <filter-label [key]="label"/>
      <ng-select class="w-24r" [items]="items" [clearSearchOnAdd]="true" [multiple]="false" [closeOnSelect]="true" [(ngModel)]="selectedValue"
                 (ngModelChange)="onChange()" bindLabel="name" bindValue="value" appendTo="body">

        <ng-template ng-label-tmp let-item="item" let-clear="clear">
          <span class="fs-14">{{ item.name | translate }}</span>
        </ng-template>
        <ng-template ng-option-tmp let-item="item">
          <span>{{ item.name | translate }}</span>
        </ng-template>
      </ng-select>
    </div>
  `,
  styles: [
  ]
})
export class ContractStatusComponent {
  @Input() selectedValue: any;
  @Input() label = 'status';
  @Output() valueChanged = new EventEmitter<string>();
  items = enumToArray(EmploymentStatus)

  onChange() {
    this.valueChanged.emit(this.selectedValue);
  }
}
