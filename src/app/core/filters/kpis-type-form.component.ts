import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation, forwardRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilterLabelComponent} from "./filter-label.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {ControlContainer, ControlValueAccessor, FormGroupDirective, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import { HttpParams } from '@angular/common/http';
import { KpisService } from '../services/kpis.service';
import {MatTooltipModule} from '@angular/material/tooltip';
@Component({
  selector: 'kpis-type-form',
  standalone: true,
  encapsulation:ViewEncapsulation.None,
  imports: [CommonModule, FilterLabelComponent, NgSelectModule, FormsModule, TranslateModule  , ReactiveFormsModule , MatTooltipModule ],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KpisTypeFormComponent),
      multi: true
    }
  ],
  template: `
    <div class="value-type">
      <i *ngIf="icon" class="fs-11 mr-50 bx {{icon}}"></i>
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
        [clearable]="true"
        [closeOnSelect]="closeOnSelect">
        <ng-template ng-option-tmp let-item="item" let-index="index">
          <div class="flex-grid select-option-kpi-{{index}}">
            <span class="py-50 col-sm-6 flex aic">
              <i class='bx bx-info-circle mr-50 pointer relative bx-tool-tip fs-18' *ngIf="item.id" (mouseover)="getEquation(item)">
                <span class="tool-tip absolute rounded p-1 card-shadow border bg-white fs-15">{{equation}}</span>
              </i>
              {{ item.name }}
            </span>
            <span class="py-50 col-sm-3">{{ item.unit }}</span>
            <span class="py-50 col-sm-3" *ngIf="item.showDataSource">{{ item.dataSource }}</span>
          </div>
        </ng-template>

      </ng-select>
      <!-- <ng-select
        [items]="allItems"
        [formControlName]="formControlName"
        (search)="search($event)"
        bindLabel="name"
        bindValue="id"
        class="{{width}} icon-input"
        appendTo="body"
        [multiple]="multiable"
        [closeOnSelect]="closeOnSelect">
      </ng-select> -->
    </div>
  `,
  styles: [`
  .select-option-kpi-0{
    cursor:no-drop;
    font-weight:bold;
  }
  .bx-tool-tip .tool-tip{
    bottom: 5px ;
    inset-inline-start: 15px;
    opacity: 0;
    transition: all 0.3s;
    word-wrap: break-word;
    overflow-wrap: break-word;
    display:none;
  }
  .bx-tool-tip:hover .tool-tip{
    opacity: 1;
    display:inline-block;
  }
  .ng-dropdown-panel .ng-dropdown-panel-items .ng-option{
    overflow: visible !important;
  }
  `]
})

export class KpisTypeFormComponent  implements OnChanges, ControlValueAccessor {
  @Input() icon: any  = 'bx-category-alt';
  @Input() selectedItem: any;
  @Input() label = 'value_type';
  @Input() labelVisibilty = true;
  @Input() width = 'w-100';
  @Input() multiable = false;
  @Input() closeOnSelect = true;
  @Input() formControlName:any = null;
  @Output() valueChanged = new EventEmitter<string>();
  searchValue: any;
  allItems:  any = [];
  totalItems: any;
  language = localStorage.getItem('language');
  equation: any = '...';
  @Input() dataSourceFilter: string | null = null;

  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private service: KpisService,){}

  ngOnInit(){
    this.getItems()
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataSourceFilter']) {
      this.getItems();
      }
  }

  search(event: any) {
    this.searchValue = event.term;
    this.getItems();
  }

  getItems() {
    let params = new HttpParams();

    if (this.searchValue) {
      params = params.set('search', this.searchValue);
    }
    if(this.dataSourceFilter) {
      params = params.set('Type', this.dataSourceFilter);
    }

    this.service.getKpiValueType(params).subscribe((res: any) => {
      if (!res?.data || !Array.isArray(res.data)) return;
      let headerItem:any = {
        valueTypeEn: "Value Type",
        valueTypeAr: "نوع القيمة",
        unitEn: "Unit",
        unitAr: "الوحدة",
        dataSourceEn: "Data Source",
        dataSourceAr: "مصدر البيانات",
        showDataSource: false,
        name: null,
        unit: null,
        dataSource: null,
      };

      headerItem.name = this.language === 'en' ? headerItem.valueTypeEn : headerItem.valueTypeAr;
      headerItem.unit = this.language === 'en' ? headerItem.unitEn : headerItem.unitAr;
      headerItem.dataSource = this.language === 'en' ? headerItem.dataSourceEn : headerItem.dataSourceAr;

      const data = res.data.map((item: any) => ({
        ...item,
        name: this.language === 'en' ? item.valueTypeEn : item.valueTypeAr,
        unit: this.language === 'en' ? item.unitEn : item.unitAr,
        dataSource: this.language === 'en' ? item.dataSourceEn : item.dataSourceAr,
        equation: item.equationEn && item.equationAr ? this.language === 'en' ? item.equationEn : item.equationAr : null
      }));

      this.allItems = [headerItem, ...data];
    });
  }

  getEquation(item:any){
    this.equation = '...'
    this.service.kpiValueTypeToolTip(item.id).subscribe((res:any)=>{
      this.equation =  this.language === 'en' ? String(res.equationEn) : String(res.equationAr)
    })
  }
  onValueChange(value: any) {
    this.onChange(value);
    this.onTouched();
    this.valueChanged.emit(value);
  }

  writeValue(value: any): void {
    this.selectedItem = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Implement if needed
  }
}
