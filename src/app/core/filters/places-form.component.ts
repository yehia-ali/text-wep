import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilterLabelComponent} from "./filter-label.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {ControlContainer, FormGroupDirective, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import { HrEmployeesService } from '../services/hr-employees.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'places-list-form',
  standalone: true,
  imports: [CommonModule, FilterLabelComponent, NgSelectModule, FormsModule, TranslateModule  , ReactiveFormsModule ],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }] ,
  template: `
    <div class="departments-filter">
      <i *ngIf="icon" class="fs-11 mr-50 bx {{icon}}"></i>
      <filter-label [key]="label" *ngIf="labelVisibilty"/>
      <ng-select
      *ngIf="formControlName"
        [items]="allItems"
        [formControlName]="formControlName"
        (search)="search($event)"
        bindLabel="{{language == 'ar' ? 'nameAr' : 'nameEn'}}"
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
export class PlacesListFormComponent {
  @Input() icon: any;
  @Input() selectedDepartment: any;
  @Input() label = 'places';
  @Input() labelVisibilty = true;
  @Input() width = 'w-100';
  @Input() multiable = false;
  @Input() closeOnSelect = true;
  @Input() formControlName:any = null;
  @Output() valueChanged = new EventEmitter<string>();
  searchValue: any;
  allItems: any;
  totalItems: any;
  language = localStorage.getItem('language')
  constructor(private service: HrEmployeesService,){}

  ngOnInit(){
    this.getItems()
  }

  search(event: any) {
    this.searchValue = event.term;
    this.getItems();
  }
  getItems() {
    let params = new HttpParams()
    if(this.searchValue){
      params = params.set('search' , this.searchValue)
    }
    this.service.getAllPlaces(params).subscribe((res: any) => {
      this.allItems = res.items;
      this.totalItems = res.totalItems;
    });
  }

  onChange() {
    this.valueChanged.emit(this.selectedDepartment);
  }

}
