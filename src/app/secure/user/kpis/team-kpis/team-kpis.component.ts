import { CommonModule, DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import * as XLSX from "xlsx";

import { LoadingComponent } from '../../../../core/components/loading.component';
import { DepartmentFilterComponent } from '../../../../core/components/new-filters/departments-filter/departments-filter.component';
import { NotFoundComponent } from '../../../../core/components/not-found.component';
import { SearchComponent } from '../../../../core/filters/search.component';
import { ArabicNumbersPipe } from '../../../../core/pipes/arabic-numbers.pipe';
import { AlertService } from '../../../../core/services/alert.service';
import { KpisService } from '../../../../core/services/kpis.service';
import { SelectUsersService } from '../../../../core/services/select-users.service';
import { DateFilterComponent } from "../../../../core/components/new-filters/date-filter/date-filter.component";
import { EvaluationFrequency, FilterType } from '../enum/filter-type.enum';
import { environment } from '../../../../../environments/environment';
import { EmployeeKpi, UserKpiData } from '../interfaces/team-kpis-interface';
import { enumToArray } from '../../../../core/functions/enum-to-array';


@Component({
  selector: 'app-team-kpis',
  templateUrl: './team-kpis.component.html',
  styleUrls: ['./team-kpis.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    TranslateModule,
    LoadingComponent,
    NotFoundComponent,
    NgxPaginationModule,
    FormsModule,
    MatCheckboxModule,
    MatTooltipModule,
    CalendarModule,
    ArabicNumbersPipe,
    SliderModule,
    SearchComponent,
    DepartmentFilterComponent,
    DateFilterComponent
  ],

})
export class TeamKpisComponent implements OnInit {
  readonly imageRootUrl = environment.imageUrl;
  readonly FilterType = FilterType;

  // Filter states
  selectedDepartment: string | null = null;

  selectedDate = {
    startDate:  this.getFormattedDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
    endDate:  this.getFormattedDate(new Date())
    };
  searchValue: string | null = null;
  
  // Table states
  loading = false;
  usersKpisDataList: UserKpiData[] = [];
  allCategoriesChecked = false;
  selectedKpis: EmployeeKpi[] = [];
  selectedKpiCategories: UserKpiData[] = [];
  unSelectedKpis: EmployeeKpi[] = [];
  unSelectedKpiCategories: UserKpiData[] = [];
  
  // Pagination
  totalItems = 0;
  limit = 15;
  page = 1;
  EvaluationFrequency = enumToArray(EvaluationFrequency);


  constructor(
    private service: KpisService,
    private datePipe: DatePipe,
    private alert: AlertService,
    private selectedUserService: SelectUsersService,
    private elm: ElementRef,
    private translate: TranslateService  // Add this

  ) {

  }

  ngOnInit(): void {
    this.getUsersKpi();
  }
  getFormattedDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  exportToExcel(): void {
    const element = this.elm.nativeElement.querySelector('#team-kpis-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'assignees.xlsx');
  }

  getUsersKpi(filterParams?: HttpParams): void {
    let params = filterParams || new HttpParams();
    params = params.set('page', this.page.toString())
                  .set('limit', this.limit.toString());
    if(this.selectedDate.startDate && this.selectedDate.endDate) { 
      params = params.set('from', this.selectedDate.startDate) 
      params = params.set('To', this.selectedDate.endDate) 
    }    
 
              
    this.service.getTeamKpi(params).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.usersKpisDataList = res.data.items;
        this.totalItems = res.data.totalItems;

      },
      error: (error) => {
        this.loading = false;
        this.alert.showAlert('Error loading KPIs', 'bg-danger');
      }
    });
  }

  applyFilter(type: FilterType, value: any): void {
    switch (type) {
      case FilterType.SEARCH:
        this.searchValue = value;
        break;
      case FilterType.DEPARTMENT:
        this.selectedDepartment = value;
        break;
      case FilterType.DATE:
        this.selectedDate = value;
        break;
    }
    this.page = 1;
    this.loadFilteredData();
  }

  loadFilteredData(): void {
    let params = new HttpParams();
    if (this.searchValue) {
      params = params.set('Search', this.searchValue);
    }
    if (this.selectedDepartment) {
      params = params.set('DepartmentId', this.selectedDepartment);
    }
    if(this.selectedDate.startDate && this.selectedDate.endDate) { 
      params = params.set('from', this.selectedDate.startDate)
      params = params.set('To', this.selectedDate.endDate)
    } else {
      return;
    }   

    this.getUsersKpi(params);
  }

  pageChanged(event: number): void {
    this.page = event;
    this.loadFilteredData();
  }

  changeLimit(): void {
    this.page = 1;
    this.loadFilteredData();
  }

  getAchievementColor(value: number | undefined): string {
    if (!value) return '';
    if (value >= 40) return 'text-purple';
    if (value >= 15) return 'text-green';
    if (value >= 13) return 'text-red';
    return '';
  }

  checkAll(event: any): void {
    this.allCategoriesChecked = event.checked;
    this.usersKpisDataList.forEach(item => {
      item.isSelected = this.allCategoriesChecked;
      this.selectRow(event, item);
    });
  }

  selectRow(event: any, item: UserKpiData | EmployeeKpi, parent?: UserKpiData | null): void {
    const isChecked = event.checked;
    item.isSelected = isChecked;

    if ('employeeKpiLists' in item) {
      // Handle category selection
      item.employeeKpiLists.forEach(kpi => {
        kpi.isSelected = isChecked;
      });
    } else if (parent) {
      // Handle KPI selection
      parent.isSelected = isChecked;
    }

    this.updateSelectedItems(item, isChecked);
    this.checkAllCheckedItems();
  }

  private updateSelectedItems(item: UserKpiData | EmployeeKpi, isChecked: boolean): void {
    if (!isChecked) {
      if ('employeeKpiLists' in item) {
        this.unSelectedKpiCategories.push(item as UserKpiData);
        (item as UserKpiData).employeeKpiLists.forEach(kpi => {
          this.unSelectedKpis.push(kpi);
        });
      } else {
        this.unSelectedKpis.push(item as EmployeeKpi);
      }
    } else {
      this.unSelectedKpiCategories = this.unSelectedKpiCategories.filter(
        category => category !== item
      );
      this.unSelectedKpis = this.unSelectedKpis.filter(
        kpi => kpi !== item
      );
    }

    this.updateSelectedLists();
  }

  private updateSelectedLists(): void {
    this.selectedKpis = [];
    this.selectedKpiCategories = [];

    this.usersKpisDataList.forEach(category => {
      if (category.isSelected) {
        this.selectedKpiCategories.push(category);
        category.employeeKpiLists.forEach(kpi => {
          if (kpi.isSelected) {
            this.selectedKpis.push(kpi);
          }
        });
      }
    });
  }

  private checkAllCheckedItems(): void {
    const allSelected = this.usersKpisDataList.every(user => user.isSelected);
    this.allCategoriesChecked = allSelected;
  }

  // --- Added for enhanced template ---
  trackByUserId(index: number, item: any): any {
    return item?.employeeId || index;
  }

  trackByKpiId(index: number, item: any): any {
    return item?.kpiId || index;
  }

}