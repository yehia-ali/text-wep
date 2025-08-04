import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilterLabelComponent} from "./filter-label.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'is-overdue',
  standalone: true,
  imports: [CommonModule, FilterLabelComponent, NgSelectModule, FormsModule , TranslateModule],
  template: `
    <div class="overdue">
      <filter-label *ngIf="!hideLabel" [key]="key"/>
      <ng-select (ngModelChange)="changeValue($event)" [(ngModel)]="selectedValue" [closeOnSelect]="true" [placeholder]="placeholder | translate"
                 [items]="[{name: translate.instant('yes'), id: true}, {name: translate.instant('no'), id: false}]"
                 [multiple]="false" appendTo="body" bindLabel="name" bindValue="id" class="w-11r {{classes}}">
      </ng-select>
    </div>

  `,
  styles: []
})
export class IsOverdueComponent {
  @Output() valueChanged = new EventEmitter();
  @Input() selectedValue!: any;
  @Input() classes = '';
  @Input() hideLabel = false;
  @Input() placeholder = 'is_overdue';
  @Input() key = 'is_overdue';
  translate = inject(TranslateService)

  changeValue($event: any) {
    this.valueChanged.emit($event);
  }
}
