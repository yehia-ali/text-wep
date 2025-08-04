import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoadingComponent } from "../loading.component";
import { NotFoundComponent } from "../not-found.component";
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { KpisService } from '../../services/kpis.service';
import { HttpParams } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { SelectUserComponent } from "../select-user.component";
import { ArabicNumbersPipe } from "../../pipes/arabic-numbers.pipe";
import { SliderModule } from 'primeng/slider';
import { SearchComponent } from "../../filters/search.component";
import { AlertService } from '../../services/alert.service';
import { DepartmentFilterComponent } from "../new-filters/departments-filter/departments-filter.component";
import { KpiCategoryFilterComponent } from "../new-filters/kpi-category-filter/kpi-category-filter.component";
import { SelectUsersService } from '../../services/select-users.service';
import { forkJoin, of, map } from 'rxjs';

@Component({
  selector: 'assign-kpis-dialog',
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
    CalendarModule,
    SelectUserComponent,
    ArabicNumbersPipe,
    SliderModule,
    SearchComponent,
    DepartmentFilterComponent,
    KpiCategoryFilterComponent
  ],
  templateUrl: './assign-kpis-dialog.component.html',
  styleUrls: ['./assign-kpis-dialog.component.scss']
})
export class AssignKpisDialogComponent {


  valid: boolean = false;
  selectedDepartment: any;
  selectedKpiCategory: any;
  searchValue: any;
  selectedKpis: any[] = [];
  selectedKpiCategories: any[] = [];
  unSelectedKpis: any[] = [];
  unSelectedKpiCategories: any[] = [];
  allCategoriesChecked: boolean;
  loading: any;
  itemsList: any[] = [];
  usersIds: any[] = [];
  totalItems: any;
  limit: any = 15;
  page: any = 1
  usersKpisDataList: any
  constructor(
    public dialogRef: MatDialogRef<AssignKpisDialogComponent>,
    public service: KpisService,
    public datePipe: DatePipe,
    public alert: AlertService,
    public selectedUserService: SelectUsersService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (this.data.users) {
      this.usersIds = this.data.users.map((user: any) => {
        return user.id;
      })
    }
  }

  ngOnInit() {
    this.getUsersKpi();
  }
  getUsersKpi() {
    let params = new HttpParams()
    this.usersIds.forEach((userId: number) => {
      params = params.append('EmployeeIds', userId.toString());
    });
    this.service.getAllEmployeesWithkpi(params).subscribe((res: any) => {
      this.usersKpisDataList = res.data
      this.getKpisList();
    })
  }

  getKpisList() {
    this.loading = true;
    let params = new HttpParams()
      .set('page', this.page)
      .set('limit', this.limit)
      .set('isApproved', true);

    if (this.searchValue) {
      params = params.append('search', this.searchValue);
    }
    if (this.selectedDepartment) {
      params = params.set('DepartmentId', this.selectedDepartment);
    }
    if (this.selectedKpiCategory) {
      params = params.set('CategoryId', this.selectedKpiCategory);
    }

    this.service.getAllKpisCategory(params).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        const userCount = this.usersIds.length;
        const categoryFrequency = new Map();
        const kpiFrequency = new Map();
        const userKpiCategories = new Set();
        const userKpis = new Set();
        const kpiRaters = new Map(); // تخزين جميع raterId لكل kpi

        this.usersKpisDataList.forEach((user: any) => {
          user.kpiCategories.forEach((category: any) => {
            if (!categoryFrequency.has(category.employeeCategoryId)) {
              categoryFrequency.set(category.employeeCategoryId, 0);
            }
            categoryFrequency.set(category.employeeCategoryId, categoryFrequency.get(category.employeeCategoryId) + 1);

            category.kpis.forEach((kpi: any) => {
              if (!kpiFrequency.has(kpi.kpiId)) {
                kpiFrequency.set(kpi.kpiId, 0);
              }
              kpiFrequency.set(kpi.kpiId, kpiFrequency.get(kpi.kpiId) + 1);

              // إضافة raterId إلى القائمة فقط إذا لم يكن موجودًا بالفعل
              if (!kpiRaters.has(kpi.kpiId)) {
                kpiRaters.set(kpi.kpiId, new Set());
              }
              kpiRaters.get(kpi.kpiId).add(kpi.raterId);
            });
          });
        });

        // الاحتفاظ فقط بالفئات المشتركة بين جميع المستخدمين
        categoryFrequency.forEach((count, categoryId) => {
          if (count === userCount) {
            userKpiCategories.add(categoryId);
          }
        });

        // الاحتفاظ فقط بالمؤشرات المشتركة بين جميع المستخدمين
        kpiFrequency.forEach((count, kpiId) => {
          if (count === userCount) {
            userKpis.add(kpiId);
          }
        });

        this.itemsList = res.data.items.map((category: any) => {
          const categorySelected = userKpiCategories.has(category.id);

          let kpisObservables = category.kpis.map((kpi: any) => {
            const kpiSelected = userKpis.has(kpi.id);
            let raterId: any = null;
            let selectedRaters$: any = of([]); // Observable افتراضي

            if (kpiSelected && kpiRaters.has(kpi.id)) {
              const raters = Array.from(kpiRaters.get(kpi.id));
              if (raters.length === 1) {
                raterId = raters[0];
                selectedRaters$ = this.selectedUserService.getSelectedUsers(raters); // تحويل إلى Observable
              } else {
                raterId = raters;
              }
            }

            return selectedRaters$.pipe(
              map((selectedRaters: any) => ({
                ...kpi,
                isSelected: kpiSelected,
                raterId: kpiSelected ? raterId : null,
                employeeId: this.usersIds,
                dateFrom: new Date(kpi.dateFrom),
                dateTo: new Date(kpi.dateTo),
                weight: kpi.weight,
                target: kpi.target,
                selectedRater: selectedRaters,
              }))
            );
          });

          let selectedCategory = {
            ...category,
            isSelected: categorySelected,
            kpis: [] as any[], // سيتم تعيينها بعد اكتمال `forkJoin`
            kpisSelected: false, // سيتم تحديثه بعد التحقق من `kpi.isSelected`
          };

          // انتظار جميع عمليات `kpisObservables`
          forkJoin(kpisObservables).subscribe((kpis: any) => {
            selectedCategory.kpis = kpis;
            selectedCategory.kpisSelected = kpis.some((kpi: any) => kpi.isSelected); // تحقق مما إذا كان أي KPI محدد
            this.selectedKpis = kpis.filter((kpi: any) => kpi.isSelected);

            if (categorySelected) {
              this.selectedKpiCategories.push(selectedCategory);
            }
          });

          return selectedCategory;
        });
        this.totalItems = res.data.totalItems;
      }
    });

  }


  department($event: any) {
    this.selectedDepartment = $event;
    this.getKpisList()
  }

  kpiCategory($event: Event) {
    this.selectedKpiCategory = $event;
    this.getKpisList()
  }

  search($event: any) {
    this.searchValue = $event;
    this.page = 1;
    this.getKpisList()
  }

  assignKpis() {
    this.valid = true; // افترض أن البيانات صالحة في البداية
    let weightIsZero = false;
    let weightIsZeroCategory = false;
    const kpiData = this.selectedKpis.map((item: any) => {
      if (
        !item.target ||
        (!item.raterId && (item.valueTypeId != 6 && item.valueTypeId != 7 && item.valueTypeId != 8)) ||
        item.employeeId.length === 0 ||
        !item.dateFrom ||
        !item.dateTo ||
        item.weight === 0
      ) {
        if (item.weight === 0) {
          weightIsZero = true;
        }
        this.valid = false; // إذا كانت أي قيمة ناقصة أو غير صالحة، قم بتعيين valid = false
        return null; // إرجاع null للعناصر غير الصالحة
      }
      return {
        kpiId: item.id,
        weight: item.weight,
        target: item.target,
        value: 0,
        raterId: item.raterId,
        employeeId: item.employeeId,
        dateFrom: this.datePipe.transform(item.dateFrom, 'yyyy-MM-dd'),
        dateTo: this.datePipe.transform(item.dateTo, 'yyyy-MM-dd'),
        rate: 0,
        evaluationfrequency: item.evaluationFrequency
      };
    }).filter(item => item !== null);
    const unKpiData = this.unSelectedKpis.map((item: any) => {


      return {
        kpiId: item.id,
        weight: item.weight,
        target: item.target,
        value: 0,
        raterId: item.raterId,
        employeeId: item.employeeId,
        dateFrom: this.datePipe.transform(item.dateFrom, 'yyyy-MM-dd'),
        dateTo: this.datePipe.transform(item.dateTo, 'yyyy-MM-dd'),
        rate: 0,
        evaluationfrequency: item.evaluationFrequency
      };
    }).filter(item => item !== null);

    const unCategoryData = this.unSelectedKpiCategories.map((item: any) => {
      return {
        kpiCategoryId: item.id,
        weight: item.weight,
        target: item.target,
        employeeId: this.usersIds,
        dateFrom: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        dateTo: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      };
    }).filter(item => item !== null);
    const categoryData = this.selectedKpiCategories.map((item: any) => {
      if (
        !item.target ||
        item.weight === 0
      ) {
        if (item.weight === 0) {
          weightIsZero = true;
        }

        this.valid = false; // إذا كانت أي قيمة ناقصة أو غير صالحة، قم بتعيين valid = false
        return null; // إرجاع null للعناصر غير الصالحة
      }
      return {
        kpiCategoryId: item.id,
        weight: item.weight,
        target: item.target,
        employeeId: this.usersIds,
        dateFrom: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        dateTo: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      };
    }).filter(item => item !== null);
    weightIsZeroCategory = kpiData.some((item: any) => item.weight === "0");
    weightIsZero = categoryData.some((item: any) => item.weight === "0");


    if (weightIsZeroCategory || weightIsZero) {
      this.valid = false;
    }

    if (this.valid) {
      let done = {
        category: false,
        kpi: false,
      }
      const kpiEmployeeVms = {
        kpiEmployeeVms: [
          ...kpiData
        ],
        unAssignkpiEmployeeVms: [
          ...unKpiData
        ]
      };
      const categorykpiEmployeeVms = {
        categorykpiEmployeeVms: [
          ...categoryData
        ],
        unAssignCategorykpiEmployeeVms: [
          ...unCategoryData
        ]
      };
      this.service.assignKpis(kpiEmployeeVms).subscribe((res: any) => {
        if (res.success) {
          this.alert.showAlert('success');
        }
        done.kpi = true
      }, (err) => {
        done.kpi = true

      });

      this.service.assignUserToCategory(categorykpiEmployeeVms).subscribe((res: any) => {
        if (res.success) {
          this.alert.showAlert('success');
        }
        done.category = true
      }, (err) => {
        done.category = true
      });

      setTimeout(() => {
        if (done.category && done.kpi) {
          this.dialogRef.close(true);
        }
      }, 1000);
    } else {
      if (weightIsZero || weightIsZeroCategory) {
        this.alert.showAlert('weight_must_be_greater_than_zero', 'bg-danger');
      } else {
        this.alert.showAlert('all_kpis_required_values', 'bg-danger');
      }
    }
  }

  selectitemsList($event: any) {
    this.allCategoriesChecked = $event.checked;
    this.itemsList.forEach((item: any) => {
      item.isSelected = this.allCategoriesChecked;
      this.selectCategory($event, item)
    });
  }
  selectCategory($event: any, item: any, parent: any = '') {
    if ($event.checked) {
      item.isSelected = true;

      // إذا كان العنصر هو Category، حدد جميع KPIs بداخله
      if (!parent && item.kpis && item.kpis.length) {
        item.kpis.forEach((kpi: any) => {
          kpi.isSelected = true;
        });
      }

      // إذا كان العنصر KPI، حدد الأب (Category)
      if (parent) {
        parent.isSelected = true;
      }
    } else {
      item.isSelected = false;

      // إذا كان العنصر Category، قم بإلغاء تحديد جميع KPIs بداخله
      if (!parent && item.kpis && item.kpis.length > 0) {
        item.kpis.forEach((kpi: any) => {
          kpi.isSelected = false;
        });
      }

      // فقط قم بإضافة العنصر غير المحدد إلى القائمة المناسبة
      if (parent) {
        this.unSelectedKpis.push(item);
      } else {
        this.unSelectedKpiCategories.push(item);
      }
    }

    this.getSelectedKpis(item); // تمرير العنصر لإضافته فقط إلى unSelected
    this.checkAllCheckedItems();
  }

  getSelectedKpis(changedItem: any) {
    this.selectedKpis = [];
    this.selectedKpiCategories = [];

    let kpiData = this.itemsList.flatMap((item: any) => item.kpis || []);
    kpiData.forEach((item: any) => {
      if (item.isSelected) {
        this.selectedKpis.push(item);
      }
    });

    this.itemsList.forEach((category: any) => {
      if (category.isSelected) {
        this.selectedKpiCategories.push(category);
      }
    });

    // التأكد من أن العنصر غير المحدد هو فقط الذي يُضاف إلى unSelectedKpis أو unSelectedKpiCategories
    if (!changedItem.isSelected) {
      if (changedItem.kpis) {
        this.unSelectedKpiCategories.push(changedItem);
        changedItem.kpis.forEach((kpi: any) => {
          this.unSelectedKpis.push(kpi);
        });
      } else {
        this.unSelectedKpis.push(changedItem);
      }
    } else {
      // قم بحذف العنصر إذا تم تحديده مرة أخرى
      this.unSelectedKpiCategories = this.unSelectedKpiCategories.filter(
        (category: any) => category !== changedItem
      );
      this.unSelectedKpis = this.unSelectedKpis.filter(
        (kpi: any) => kpi !== changedItem
      );

      // إذا كان العنصر `Category`، احذف أيضًا جميع `KPIs` بداخله من `unSelectedKpis`
      if (changedItem.kpis) {
        this.unSelectedKpis = this.unSelectedKpis.filter(
          (kpi: any) => !changedItem.kpis.includes(kpi)
        );
      }
    }
  }

  checkAllCheckedItems() {
    let selectedLength = 0
    this.itemsList.forEach((user: any) => {
      if (user.isSelected) {
        selectedLength++;
      }
    });
  }

  pageChanged($event: number) {
    this.page = $event
    this.getKpisList()
  }

  changeLimit() {
    this.page = 1
    this.getKpisList()
  }

}
