import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FilterLabelComponent} from "./filter-label.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {enumToArray} from "../functions/enum-to-array";
import {EmploymentType} from "../enums/employment-type";

@Component({
  selector: 'contract-type',
  standalone: true,
  imports: [CommonModule, FilterLabelComponent, NgSelectModule, TranslateModule, FormsModule],
  template: `
    <div class="contract-type">
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
export class ContractTypeComponent {
  @Input() selectedValue: any;
  @Input() label = 'type';
  @Output() valueChanged = new EventEmitter<string>();
  items = enumToArray(EmploymentType)

  onChange() {
    this.valueChanged.emit(this.selectedValue);
  }
}
