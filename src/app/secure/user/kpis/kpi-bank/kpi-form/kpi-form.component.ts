import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { MatButtonModule } from "@angular/material/button";
import { AlertService } from 'src/app/core/services/alert.service';
import { KpisService } from 'src/app/core/services/kpis.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KpisTypeFormComponent } from "../../../../../core/filters/kpis-type-form.component";
import { KpiCategoryDropdownFormComponent } from 'src/app/core/filters/kpis-category-dropdown-form.component';
import { DepartmentsFormComponent } from 'src/app/core/filters/departments-form.component';
import { CalendarModule } from 'primeng/calendar';
import { kpiRepetitionOptions, KpiType } from '../../enum/filter-type.enum';
import { NgSelectModule } from '@ng-select/ng-select';
import { InputErrorComponent } from 'src/app/core/inputs/input-error.component';

@Component({
  selector: 'kpi-form',
  standalone: true,
  imports: [
    TranslateModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    KpisTypeFormComponent,
    KpiCategoryDropdownFormComponent,
    DepartmentsFormComponent,
    CalendarModule,
    NgSelectModule,
    InputErrorComponent
],
  templateUrl: './kpi-form.component.html',
  styleUrls: ['./kpi-form.component.scss'],
})
export class KpiFormComponent {
  form: FormGroup;
  editMode = this.data.update
  kpiMode = this.data.kpi
  allItems: any[] = []
  KpiType = KpiType;
  kpiRepetitionOptions = kpiRepetitionOptions;
  isSubmitting = false;
  
  constructor(
    private service: KpisService ,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<KpiFormComponent>,
    private alert:AlertService,
    private fb:FormBuilder,
    private datePipe:DatePipe,

  ) {
    if(this.kpiMode){
      let categoryId :any
      if(this.editMode){
        categoryId = this.data.item.categoryId
      }else{
        categoryId = null
      }
      this.form = this.fb.group(
        {
          name:['' , Validators.required],
          describtion:[''],
          weight:[0 , [Validators.required , Validators.pattern('^[0-9]*$'), Validators.min(1)]],
          target:[0 , [Validators.required , Validators.pattern('^[0-9]*$')]],
          evaluationFrequency:[6],
          departmentId:[null],
          dateFrom:['',Validators.required ],
          dateTo:['',Validators.required ],
          valueTypeId:[null , Validators.required],
          categoryId:[categoryId , Validators.required],
          kpiType:[2 , Validators.required],
          isOverAchive:[false],
        }
      )
    }else{
      this.form = this.fb.group(
        {
          name:['' , Validators.required],
          weight:[0 , [Validators.required , Validators.pattern('^[0-9]*$')]],
          target:[0 , [Validators.required , Validators.pattern('^[0-9]*$')]],
          describtion:[''],
        }
      )
    }
  }

  ngOnInit(): void {
    if(this.editMode){
      this.form.patchValue({
        ...this.data.item,
        dateFrom:new Date(this.data.item.dateFrom),
        dateTo:new Date(this.data.item.dateTo),
      })
    }
    
  }
  get f() {
    return this.form.controls;
  }
  createOrUpdate() {
    if (this.isSubmitting) {
      return;
    }

    if(this.form.value.dateFrom){this.form.value.dateFrom = this.datePipe.transform(this.form.value.dateFrom, 'yyyy-MM-dd')};
    if(this.form.value.dateTo){this.form.value.dateTo = this.datePipe.transform(this.form.value.dateTo, 'yyyy-MM-dd')};
    if(!this.form.value.evaluationFrequency){
      this.form.value.evaluationFrequency = 0
    }
    let data = this.form.value
    if(this.form.valid){
      this.isSubmitting = true;
      if(!this.kpiMode){
        if(this.editMode){
          data.id = this.data.item.id
          this.service.updateKpisCategory(data).subscribe({
            next: (res: any) => {
              if (res?.success) {
                this.alert.showAlert('success');
                this.dialogRef.close(true);
              }
            },
            complete: () => {
              this.isSubmitting = false;
            }
          });
        }else{
          this.service.createKpisCategory(data).subscribe({
            next: (res: any) => {
              if (res?.success) {
                this.alert.showAlert('success');
                this.dialogRef.close(true);
              }
            },
            complete: () => {
              this.isSubmitting = false;
            }
          });
        }
      }else{
        if(this.editMode){
          data.id = this.data.item.id
          this.service.updateKpi(data).subscribe({
            next: (res: any) => {
              if (res?.success) {
                this.alert.showAlert('success');
                this.dialogRef.close(true);
              }
            },
            complete: () => {
              this.isSubmitting = false;
            }
          });
        }else{
          this.service.createKpi(data).subscribe({
            next: (res: any) => {
              if (res?.success) {
                this.alert.showAlert('success');
                this.dialogRef.close(true);
              }
            },
            complete: () => {
              this.isSubmitting = false;
            }
          });
        }
      }
    }else{
      this.form.markAllAsTouched()
    }
  }
  onKpiTypeChange() {
    this.form.get('valueTypeId')?.reset();
  }
}
