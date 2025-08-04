import {Component, EventEmitter, Input, Output, forwardRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilterLabelComponent} from "./filter-label.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {ControlContainer, FormGroupDirective, FormsModule, ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import { HrEmployeesService } from '../services/hr-employees.service';

@Component({
  selector: 'genders',
  standalone: true,
  imports: [CommonModule, FilterLabelComponent, NgSelectModule, FormsModule, TranslateModule, ReactiveFormsModule],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GendersComponent),
      multi: true
    }
  ],
  template: `
    <div class="">
      <i *ngIf="icon" class="fs-11 mr-50 bx {{icon}}"></i>
      <filter-label [key]="label" *ngIf="labelVisibilty"/>
      <ng-select
        [items]="allItems"
        [formControlName]="formControlName"
        (search)="search($event)"
        bindLabel="nameAr"
        bindValue="id"
        class="{{width}} icon-input"
        appendTo="body"
        [multiple]="multiable"
        [closeOnSelect]="closeOnSelect"
        (change)="handleChange($event)">
      </ng-select>
    </div>
  `,
  styles: []
})
export class GendersComponent implements ControlValueAccessor {
  @Input() icon: any;
  @Input() selectedDepartment: any;
  @Input() label = 'gender';
  @Input() labelVisibilty = true;
  @Input() width = 'w-100';
  @Input() multiable = false;
  @Input() closeOnSelect = true;
  @Input() formControlName: any = null;
  @Output() valueChanged = new EventEmitter<string>();
  searchValue: any;
  allItems: any;
  totalItems: any;
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private service: HrEmployeesService) {}

  writeValue(value: any): void {
    this.selectedDepartment = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implement if needed
  }

  ngOnInit() {
    this.getItems();
  }

  search(event: any) {
    this.searchValue = event.term;
    this.getItems();
  }

  getItems() {
    let params: any = {
      limit: 30,
      search: this.searchValue,
    };
    this.service.getAllGenders().subscribe((res: any) => {
      this.allItems = res.data.items;
      this.totalItems = res.data.totalItems;
    });
  }

  handleChange(event: any) {
    this.valueChanged.emit(event.id);
    this.onChange(event.id);
    this.onTouched();
  }
}
