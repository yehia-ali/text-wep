import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilterLabelComponent} from "./filter-label.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'assignee-state',
  standalone: true,
  imports: [CommonModule, FilterLabelComponent, NgSelectModule, FormsModule],
  template: `
      <div class="user-state">
          <filter-label key="assignee_state"/>
          <ng-select (ngModelChange)="changeValue($event)" [(ngModel)]="selectedValue" [closeOnSelect]="true"
                     [items]="[{name: translate.instant('active'), id: true}, {name: translate.instant('inactive'), id: false}]"
                     [multiple]="false" appendTo="body" bindLabel="name" bindValue="id" class="w-15r">
          </ng-select>
      </div>
  `,
  styles: []
})
export class AssigneeStateComponent {
  @Output() valueChanged = new EventEmitter();
  @Input() selectedValue!: any;
  translate = inject(TranslateService)

  changeValue($event: any) {
    this.valueChanged.emit($event);
  }
}
