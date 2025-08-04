import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilterLabelComponent} from "./filter-label.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {ControlContainer, FormGroupDirective, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import { EvaluationFrequency } from '../enums/evaluation-frequency';
import { enumToArray } from '../functions/enum-to-array';

@Component({
  selector: 'evaluation-frequency-dropdown-form',
  standalone: true,
  imports: [CommonModule, FilterLabelComponent, NgSelectModule, FormsModule, TranslateModule  , ReactiveFormsModule ],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }] ,
  template: `
    <div class="">
      <i *ngIf="icon" class="fs-11 mr-50 bx {{icon}}"></i>
      <filter-label [key]="label" *ngIf="labelVisibilty"/>
      <ng-select
        [items]="allItems"
        [formControlName]="formControlName"
        bindLabel="name"
        bindValue="value"
        class="{{width}} icon-input"
        appendTo="body"
        [multiple]="multiable"
        [closeOnSelect]="closeOnSelect">
      </ng-select>
    </div>

  `,
  styles: []
})

export class EvaluationFrequencyDropdownFormComponent {
  @Input() icon: any  = 'bx-repost';
  @Input() selectedItem: any;
  @Input() label = 'repeated_rate';
  @Input() labelVisibilty = true;
  @Input() width = 'w-100';
  @Input() multiable = false;
  @Input() closeOnSelect = true;
  @Input() formControlName:any = 'evaluationFrequency';
  @Output() valueChanged = new EventEmitter<string>();
  searchValue: any;
  language = localStorage.getItem('language');
  allItems = enumToArray(EvaluationFrequency);

  ngOnInit(){}

  onChange() {
    this.valueChanged.emit(this.selectedItem);
  }

}
