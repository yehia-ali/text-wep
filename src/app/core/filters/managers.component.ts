import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {FilterLabelComponent} from "./filter-label.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {GlobalService} from "../services/global.service";

@Component({
  selector: 'managers',
  standalone: true,
  imports: [CommonModule, TranslateModule, FilterLabelComponent, NgSelectModule, FormsModule],
  template: `
    <div class="user">
      <filter-label key="managers"/>
      <ng-select class="w-24r" [items]="managers" [multiple]="true" [closeOnSelect]="false" [clearSearchOnAdd]="true" [(ngModel)]="selectedValue" (ngModelChange)="onChange()" bindLabel="name" bindValue="id"
                 appendTo="body">

        <ng-template ng-multi-label-tmp let-items="items" let-clear="clear">
          <div class="ng-value flex aic">
                  <span class="ng-value-label">
                    <span class="flex aic fs-12">
                    <span *ngIf="items[0].name.length >= 10">{{items[0].name | slice:0:10}}...</span>
                    <span *ngIf="items[0].name.length < 10">{{items[0].name}}</span>
                    </span>
                  </span>
            <span class="ng-value-icon right" (click)="clear(items[0])" aria-hidden="true">×</span>
          </div>
          <div class="ng-value rounded-2" *ngIf="items.length > 1">
            <span class="ng-value-label fs-12">{{items.length - 1}} {{'more' | translate}}...</span>
          </div>
        </ng-template>
      </ng-select>
    </div>

  `,
  styles: []
})
export class ManagersComponent {
  @Input() selectedValue: any[] = [];
  @Output() valueChanged = new EventEmitter<any>()
  service = inject(GlobalService);
  managers = [];

  ngOnInit(): void {
    this.service.activeManagers.subscribe(res => this.managers = res || []);
    if (this.managers.length == 0) {
      this.service.getActiveManagers().subscribe()
    }
  }

  onChange() {
    this.valueChanged.emit(this.selectedValue);
  }
}
