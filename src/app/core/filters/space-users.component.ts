import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterLabelComponent } from "./filter-label.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { HrEmployeesService } from '../services/hr-employees.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'space-users',
  standalone: true,
  imports: [CommonModule, FilterLabelComponent, NgSelectModule, FormsModule, TranslateModule],
  template: `
    <div class="status {{ newFilter ? 'new-filter' : '' }}">
      <i *ngIf="icon" class="fs-11 mr-50 bx {{icon}}"></i>
      <filter-label [key]="label" *ngIf="labelVisibilty"></filter-label>
      <ng-select
        [items]="allItems"
        [(ngModel)]="selectedItem"
        (change)="onChange($event)"
        bindLabel="name"
        bindValue="id"
        class="{{width}}"
        appendTo="body"
        [multiple]="multiable"
        (search)="search($event)"
        [closeOnSelect]="closeOnSelect">
      </ng-select>
      <span
        class="rounded-5 bg-primary count flex aic jcc fs-11 simibold white ml-50"
        *ngIf="newFilter && selectedItem.length > 0"
      >
        {{ selectedItem.length }}
      </span>
    </div>
  `,
  styles: []
})
export class SpaceUsersComponent {
  @Input() icon: any;
  @Input() label = 'users';
  @Input() labelVisibilty = true;
  @Input() width = 'w-100';
  @Input() multiable = false;
  @Input() closeOnSelect = true;
  @Output() valueChanged = new EventEmitter<any>();  // EventEmitter to emit the selected user
  @Input() newFilter = false;
  @Input() isUserManager = false;

  selectedItem: any|any[] = [];
  searchValue: any;
  allItems: any[] = [];  // Ensure allItems is initialized as an empty array
  totalItems: number;

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
    if(this.isUserManager){
      let userId:any = localStorage.getItem('id')
      params = params.set('managers' , userId)
    }
    this.service.getUsers(params).subscribe((res: any) => {
      this.allItems = res.data.items;
      this.totalItems = res.data.totalItems;
    });
  }

  // Emit the selected item when changed
  onChange(event: any) {
    this.valueChanged.emit(this.selectedItem);
  }
}
