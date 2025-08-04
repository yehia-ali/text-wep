import { map } from 'rxjs';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilterLabelComponent} from "./filter-label.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {ControlContainer, FormGroupDirective, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import { HttpParams } from '@angular/common/http';
import { KpisService } from '../services/kpis.service';

@Component({
  selector: 'kpi-category-dropdown-form',
  standalone: true,
  imports: [CommonModule, FilterLabelComponent, NgSelectModule, FormsModule, TranslateModule  , ReactiveFormsModule ],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }] ,
  template: `
    <div class="">
      <i *ngIf="icon && labelVisibilty" class="fs-11 mr-50 bx {{icon}}"></i>
      <filter-label [key]="label" *ngIf="labelVisibilty"/>
      <ng-select
        [items]="allItems"
        [formControlName]="formControlName"
        (search)="search($event)"
        bindLabel="name"
        bindValue="id"
        class="{{width}} icon-input"
        appendTo="body"
        [multiple]="multiable"
        [closeOnSelect]="closeOnSelect">
      </ng-select>
    </div>

  `,
  styles: []
})

export class KpiCategoryDropdownFormComponent {
  @Input() icon: any  = 'bx-category-alt';
  @Input() selectedItem: any;
  @Input() label = 'kpi_category_name';
  @Input() labelVisibilty = true;
  @Input() width = 'w-100';
  @Input() multiable = false;
  @Input() closeOnSelect = true;
  @Input() formControlName:any = null;
  @Output() valueChanged = new EventEmitter<string>();
  searchValue: any;
  allItems: any = [];
  totalItems: any;
  language = localStorage.getItem('language');
  constructor(private service: KpisService,){}

  ngOnInit(){
    this.getItems()
  }

  search(event: any) {
    this.searchValue = event.term;
    this.getItems();
  }
  getItems() {
    let params = new HttpParams().set('limit' , 30).set('IsApproved' , true);
    if(this.searchValue){
      params = params.set('search' , this.searchValue)
    }
    this.service.getAllKpisCategory(params).subscribe((res: any) => {

      this.allItems = res.data.items.map((item:any) => {
        return item
      });

      // this.totalItems = res.data.totalItems;
    });
  }

  onChange() {
    this.valueChanged.emit(this.selectedItem);
  }

}
