import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterLabelComponent } from './filter-label.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HrEmployeesService } from '../services/hr-employees.service';

@Component({
  selector: 'all-shifts',
  standalone: true,
  imports: [
    CommonModule,
    FilterLabelComponent,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="">
      <i *ngIf="icon" class="fs-11 mr-50 bx {{ icon }}"></i>
      <filter-label [key]="label" *ngIf="labelVisibilty"></filter-label>

      <!-- Use ng-select with or without formControlName -->
      <ng-select
        *ngIf="formControlName"
        [items]="allItems"
        [formControlName]="formControlName"
        (change)="onChange()"
        (search)="search($event)"
        bindLabel="shiftName"
        bindValue="id"
        class="{{ width }} icon-input"
        appendTo="body"
        [multiple]="multiable"
        [(ngModel)]="selectedItem"
        [closeOnSelect]="closeOnSelect"
      ></ng-select>

      <ng-select
        *ngIf="!formControlName"
        [items]="allItems"
        (change)="onChange()"
        (search)="search($event)"
        bindLabel="shiftName"
        bindValue="id"
        class="{{ width }} icon-input"
        appendTo="body"
        [multiple]="multiable"
        [(ngModel)]="selectedItem"
        [closeOnSelect]="closeOnSelect"
      ></ng-select>
    </div>
  `,
  styles: [],
})
export class AllShiftsComponent {
  @Input() icon: any;
  @Input() selectedItem: any;
  @Input() label = 'shift';
  @Input() labelVisibilty = true;
  @Input() width = 'w-100';
  @Input() multiable = false;
  @Input() closeOnSelect = true;
  @Input() formControlName: any = null;
  @Output() valueChanged = new EventEmitter<string>();

  searchValue: any;
  allItems: any;

  constructor(private service: HrEmployeesService) {}

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
    this.service.getShifts(params).subscribe((res: any) => {
      this.allItems = res.data;
    });
  }

  onChange() {
    this.valueChanged.emit(this.selectedItem);
  }
}
