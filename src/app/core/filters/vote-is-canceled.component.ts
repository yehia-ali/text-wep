import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilterLabelComponent} from "./filter-label.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'vote-is-canceled',
  standalone: true,
  imports: [CommonModule, FilterLabelComponent, NgSelectModule, FormsModule],
  template: `
      <div class="is-canceled">
          <filter-label key="is_canceled"/>
          <ng-select (ngModelChange)="changeValue($event)" [(ngModel)]="selectedValue" [closeOnSelect]="true"
                     [items]="[{name: translate.instant('yes'), id: 1}, {name: translate.instant('no'), id: 2}]" [multiple]="false" appendTo="body" bindLabel="name" bindValue="id" class="w-15r">
          </ng-select>
      </div>
  `,
  styles: []
})
export class VoteIsCanceledComponent {
  translate = inject(TranslateService)
  @Output() valueChanged = new EventEmitter();
  @Input() selectedValue!: [];

  changeValue($event: any) {
    this.valueChanged.emit($event);
  }
}
