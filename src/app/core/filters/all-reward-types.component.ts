import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterLabelComponent } from './filter-label.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ControlContainer, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HrEmployeesService } from '../services/hr-employees.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'all-reward-types',
  standalone: true,
  imports: [
    CommonModule,
    FilterLabelComponent,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
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
        [bindLabel]="language == 'en' ? 'name' : 'nameAr'"
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
        [bindLabel]="language == 'en' ? 'name' : 'nameAr'"
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
export class AllRewardTypesComponent {
  @Input() icon: any;
  @Input() selectedItem: any;
  @Input() label = 'rewards_types';
  @Input() labelVisibilty = true;
  @Input() width = 'w-100';
  @Input() multiable = false;
  @Input() closeOnSelect = true;
  @Input() formControlName: any = null;
  @Output() valueChanged = new EventEmitter<string>();
  language = localStorage.getItem('language')
  searchValue: any = '';
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
    let params = new HttpParams().set('limit' , 30)
    if(this.searchValue){
      params = params.set('search' , this.searchValue)
    }
    this.service.getAllSalaryAffectsTypes(params).subscribe((res: any) => {
      this.allItems = res.data.items;
    });
  }

  onChange() {
    this.valueChanged.emit(this.selectedItem);
  }
}
