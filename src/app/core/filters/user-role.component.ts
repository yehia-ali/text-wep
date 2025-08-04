import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {InputLabelComponent} from "../inputs/input-label.component";
import { FilterLabelComponent } from "./filter-label.component";

@Component({
  selector: 'user-role',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgSelectModule, FormsModule, InputLabelComponent, FilterLabelComponent],
  template: `
      <div class="role">
          <filter-label key="role" *ngIf="!hideLabel"></filter-label>
          <ng-select class="w-15r" [items]="[{name: translate.instant('admin'), value: 'e48dc06c-bde7-416b-bf21-7077db9f5367'}, {name: translate.instant('employee'), value: '0'}]" [multiple]="false"
                     [closeOnSelect]="true" [(ngModel)]="selectedValue" (ngModelChange)="onChange()" bindLabel="name" bindValue="value" appendTo="body">
              <ng-template ng-option-tmp let-item="item" let-item$="item$" let-index="index">
                  {{item.name | translate}}
              </ng-template>
              <ng-template ng-label-tmp let-item="item" let-clear="clear">
                  <span class="fs-14">{{item.name | translate}}</span>
              </ng-template>
          </ng-select>
      </div>

  `,
  styles: []
})
export class UserRoleComponent {
  @Input() selectedValue: any;
  @Output() valueChanged = new EventEmitter();
  @Input() hideLabel = false;

  constructor(public translate: TranslateService) {
  }

  ngOnInit(): void {
  }

  onChange() {
    setTimeout(() => {
      this.valueChanged.emit(this.selectedValue);
    });
  }
}
