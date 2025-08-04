import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ArabicNumbersPipe} from "../pipes/arabic-numbers.pipe";
import {FilterLabelComponent} from "./filter-label.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'rate-value',
  standalone: true,
  imports: [CommonModule, TranslateModule, FilterLabelComponent, NgSelectModule, FormsModule],
  template: `
      <div class="rate-value">
          <filter-label [key]="label"/>
          <ng-select class="w-17r" [items]="list" [(ngModel)]="selectedValue" (ngModelChange)="onChange()" bindLabel="name" bindValue="value" appendTo="body" [multiple]="true" [closeOnSelect]="false">
              <ng-template ng-option-tmp let-item="item" let-item$="item$" let-index="index">
                  {{item.name | translate}}
              </ng-template>
              <ng-template ng-label-tmp let-item="item" let-clear="clear">
                  <span class="fs-14 px-50 rounded-5">{{item.name | translate}}</span>
              </ng-template>
          </ng-select>
      </div>
  `,
  styles: []
})
export class RateValueComponent {
  @Output() valueChanged = new EventEmitter();
  @Input() selectedValue!: boolean;
  @Input() label = 'rate_value';
  list = [
    {name: this.arabicNumber.transform(1), value: 1},
    {name: this.arabicNumber.transform(2), value: 2},
    {name: this.arabicNumber.transform(3), value: 3},
    {name: this.arabicNumber.transform(4), value: 4},
    {name: this.arabicNumber.transform(5), value: 5},
  ]

  constructor(public translate: TranslateService, private arabicNumber: ArabicNumbersPipe) {
  }

  ngOnInit(): void {
  }

  onChange() {
    this.valueChanged.emit(this.selectedValue);
  }
}
