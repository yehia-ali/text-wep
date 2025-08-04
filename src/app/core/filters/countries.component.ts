import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterLabelComponent } from './filter-label.component';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  ControlContainer,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HrEmployeesService } from '../services/hr-employees.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'countries',
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
    <div class="flex-grid">
      <div [ngClass]="col">
        <i *ngIf="countryIcon" class="fs-11 mr-50 bx {{ countryIcon }}"></i>
        <filter-label [key]="countryLabel" *ngIf="labelVisibilty" />
        <ng-select
          [items]="allCountries"
          [formControlName]="formControlCountry"
          (search)="search($event)"
          bindLabel="arName"
          bindValue="id"
          class="{{ width }} icon-input"
          appendTo="body"
          [multiple]="multiable"
          [closeOnSelect]="closeOnSelect"
          (change)="countryChange($event)"
        >
        </ng-select>
      </div>

      <div [ngClass]="col" *ngIf="!noReagon">
        <i *ngIf="regionIcon" class="fs-11 mr-50 bx {{ regionIcon }}"></i>
        <filter-label [key]="regionLabel" *ngIf="labelVisibilty" />
        <ng-select
          [items]="allRegions"
          [formControlName]="formControlRegion"
          (search)="search($event)"
          bindLabel="nameAr"
          bindValue="id"
          class="{{ width }} icon-input"
          appendTo="body"
          [multiple]="multiable"
          [closeOnSelect]="closeOnSelect"
        >
        </ng-select>
      </div>
    </div>
  `,
  styles: [],
})
export class CountriesComponent {
  @Input() countryIcon: any;
  @Input() countryLabel = 'country';
  @Input() regionLabel = 'city';
  @Input() regionIcon: any;
  @Input() labelVisibilty = true;
  @Input() width = 'w-100';
  @Input() multiable = false;
  @Input() closeOnSelect = true;
  @Input() formControlCountry: string | null = null;
  @Input() formControlRegion: string | null = null;
  @Input() noReagon = false;
  @Input() col: string = 'col-lg-6';
  @Input() reagonOnly: boolean = false;
  @Output() valueChanged = new EventEmitter<string>();

  searchValue: string | null = null;
  allCountries: any[] = [];
  allRegions: any[] = [];
  countryId: any = null;

  constructor(private service: HrEmployeesService) {}

  ngOnInit() {
    this.getCountries();
  }

  search(event: any) {
    this.searchValue = event.term;
    this.getCountries();
  }

  getCountries() {
    let params: any = {
      limit: 30,
      search: this.searchValue,
    };
    this.service.getAllCountry().subscribe((res: any) => {
      this.allCountries = res.data.items;
      if (this.formControlRegion) {
        this.getRegions();
      }
    });
  }

  getRegions() {
    let params = new HttpParams();
    if (this.countryId) {
      params = params.set('CountryId', this.countryId.toString());
    }
    this.service.getAllRegions(params).subscribe((res: any) => {
      this.allRegions = res.data.items;
    });
  }

  countryChange(event: any) {
    this.countryId = event.id;
    this.getRegions();
  }

  onChange() {
    this.valueChanged.emit(this.countryId?.toString() || '');
  }
}
