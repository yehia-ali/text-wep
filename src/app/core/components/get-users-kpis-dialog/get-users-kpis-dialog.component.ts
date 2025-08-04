import { map } from 'rxjs';
import { Component, EventEmitter, Inject ,Output} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KpisService } from '../../services/kpis.service';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from "../loading.component";
import { NotFoundComponent } from "../not-found.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserWithImageComponent } from "../user-with-image/user-with-image.component";

@Component({
  selector: 'get-users-kpis-dialog',
  templateUrl: './get-users-kpis-dialog.component.html',
  standalone:true,
  imports: [TranslateModule, LoadingComponent, NotFoundComponent, CommonModule, FormsModule, NgSelectModule, UserWithImageComponent],
  styleUrls: ['./get-users-kpis-dialog.component.scss']
})
export class GetUsersKpisDialogComponent {
  @Output() kpisValue = new EventEmitter()
  loading = true;
  itemsList: any[] = [];
  assignees: any[] = [];
  selectedUsersKpis: any[] = [];
  selectedCategory: any;
  backupItemsList: any[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: KpisService,
    public dialogRef: MatDialogRef<GetUsersKpisDialogComponent>,
  ){
    this.assignees = this.data.assignees.map((item:any) =>{
      return item.assigneeId
    })
    if(this.data.selectedData && this.data.selectedData.length > 0){
      this.selectedUsersKpis = this.data.selectedData.map((item:any) =>{
        return item
      })
    }
  }

  ngOnInit(){
    this.getItemsList()
  }

  getItemsList() {
    this.loading = true
    let params = new HttpParams().set('IsAutomatic', 'true');

    if (this.assignees.length > 0) {
      this.assignees.forEach((item: any) => {
        params = params.append('EmployeeIds', item);
      });

      this.service.getAllEmployeesWithkpi(params).subscribe((res: any) => {
        this.itemsList = res.data.map((item: any) => {
          const matchedUser = this.selectedUsersKpis.find((selected: any) => selected.userId === item.userId);
          let selectedCategory = null;
          let selectedKpi = null;
          if (matchedUser) {
            selectedCategory = item.kpiCategories.find((category: any) =>
              category.employeeCategoryId === matchedUser.employeeCategoryId
            );

            if (selectedCategory) {
              selectedKpi = selectedCategory.kpis.find((kpi: any) =>
                kpi.employeeKpiId === matchedUser.employeeKpiId
              );
            }
          }

          let data =  {
            ...item,
            selectedCategory: selectedCategory || null, // تعيين الفئة المحددة أو null إذا لم يتم العثور عليها
            selectedKpi: selectedKpi || null, // تعيين KPI المحدد أو null إذا لم يتم العثور عليه
          };
          return data
        });

        this.loading = false;
      });
    }else{
      this.loading = false
    }
  }


  onCategoryChange(selectedCategory: any, item: any) {
    if (selectedCategory && selectedCategory.employeeCategoryId !== item.selectedCategory?.employeeCategoryId) {
      item.selectedCategory = selectedCategory;
      item.selectedKpi = null; // إعادة ضبط KPI عند تغيير الفئة
    }
  }

  submit(){
    const data = this.itemsList.filter((item: any) => item.selectedKpi).map((item:any) => {
      return {
        userId:item.userId,
        employeeCategoryId:item.selectedCategory.employeeCategoryId,
        employeeKpiId:item.selectedKpi.employeeKpiId || item.selectedKpi,
      }
    })
    this.kpisValue.emit(data);
    this.dialogRef.close(data)
  }

  compareCategories(category1: any, category2: any): boolean {
    return category1 && category2 ? category1.employeeCategoryId === category2.employeeCategoryId : category1 === category2;
  }

  compareKpis(kpi1: any, kpi2: any): boolean {
    return kpi1 && kpi2 ? kpi1.employeeKpiId === kpi2.employeeKpiId : kpi1 === kpi2;
  }

}
