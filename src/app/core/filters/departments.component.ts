import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilterLabelComponent} from "./filter-label.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {GlobalService} from "../services/global.service";

@Component({
  selector: 'departments',
  standalone: true,
  imports: [CommonModule, FilterLabelComponent, NgSelectModule, FormsModule, TranslateModule ],
  template: `
    <div class="departments-filter">
      <filter-label [key]="label" *ngIf="labelVisibilty"/>
      <ng-select
        class="{{width}} icon-input"
        [items]="service.departments$ | async"
        [clearSearchOnAdd]="true"
        [multiple]="multiable"
        [closeOnSelect]="closeOnSelect"
        [(ngModel)]="selectedDepartment"
        (ngModelChange)="onChange()"
        bindLabel="name"
        bindValue="id"
        appendTo="body">

        <ng-template ng-multi-label-tmp let-items="items" let-clear="clear">
          <div class="ng-value flex aic">
                  <span class="ng-value-label">
                    <span class="flex aic fs-10">
                    <span *ngIf="items[0].name.length >= 10">{{items[0].name | slice:0:10}}...</span>
                    <span *ngIf="items[0].name.length < 10">{{items[0].name}}</span>
                    </span>
                  </span>
            <span class="ng-value-icon right" (click)="clear(items[0])" aria-hidden="true">×</span>
          </div>
          <div class="ng-value rounded-2" *ngIf="items.length > 1">
            <span class="ng-value-label fs-10">{{items.length - 1}} {{'more' | translate}}...</span>
          </div>
        </ng-template>
      </ng-select>

    </div>

  `,
  styles: []
})
export class DepartmentsComponent {
  @Input() selectedDepartment: any;
  @Input() label = 'departments';
  @Input() labelVisibilty = true;
  @Input() width = 'w-24r';
  @Input() multiable = true;
  @Input() closeOnSelect = false;
  @Input() formControlName:any = null;
  @Output() valueChanged = new EventEmitter<string>();
  service = inject(GlobalService);

  onChange() {
    this.valueChanged.emit(this.selectedDepartment);
  }

}
