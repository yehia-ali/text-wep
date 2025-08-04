import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgSelectModule} from "@ng-select/ng-select";
import {FilterLabelComponent} from "./filter-label.component";
import {FormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'is-rated',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FilterLabelComponent, FormsModule , TranslateModule],
  template: `
    <div class="rate">
      <filter-label *ngIf="!hideLabel" key="rate"/>
      <ng-select (ngModelChange)="changeValue($event)" [(ngModel)]="selectedValue" [closeOnSelect]="true" [placeholder]="'rate' | translate"
                 [items]="[{name: translate.instant('rated'), id: true}, {name: translate.instant('unrated'), id: false}]"
                 [multiple]="false" appendTo="body" bindLabel="name" bindValue="id" class="w-11r {{classes}}">
      </ng-select>
    </div>

  `,
  styles: []
})
export class IsRatedComponent {
  @Output() valueChanged = new EventEmitter();
  @Input() selectedValue!: any;
  @Input() classes = '';
  @Input() hideLabel = false;
  translate = inject(TranslateService)

  changeValue($event: any) {
    this.valueChanged.emit($event);
  }
}
