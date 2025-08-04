import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { AlertService } from '../../../../../core/services/alert.service';
import { HrEmployeesService } from '../../../../../core/services/hr-employees.service';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgSelectModule } from '@ng-select/ng-select';
import { InputLabelComponent } from '../../../../../core/inputs/input-label.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateService } from '@ngx-translate/core';
import { LoadingComponent } from 'src/app/core/components/loading.component';
@Component({
  selector: 'payroll-cycle',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    TranslateModule, 
    MatButtonModule, 
    ReactiveFormsModule, 
    InputLabelComponent, 
    NgSelectModule, 
    AngularEditorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule, 
    FormsModule,
    LoadingComponent
  ],
  providers: [
  ],
  templateUrl: './payroll-cycle.component.html',
  styleUrls: ['./payroll-cycle.component.scss'],
})
export class PayrollCycleComponent implements OnInit {
  form: FormGroup;
  isEditing = false;
  private alert = inject(AlertService);
  payrollCycle: any;
  crossMonth: boolean = false;
  daysList = Array.from({ length: 28 }, (_, i) => ({
    value: i + 2,
    label: (i + 2).toString()
  }));  
  loading = true;
  currentLanguage = this.translate.currentLang;
  originalData: any; 

  constructor(
    private fb: FormBuilder,
    private service: HrEmployeesService,
    private dateAdapter: DateAdapter<any>,
    private translate: TranslateService
  ) {
    this.dateAdapter.setLocale('en-GB');
    this.initform();
  }

  ngOnInit() {
    this.getPayrollCycle();
    this.onCrossMonthChange();
  }

  initform() {
    this.form = this.fb.group({
      leaveSystem: [false, [Validators.required]],
      fromDay: [1, [Validators.required]],
      toDay: [null, [Validators.required]],
      crossMonth: [false, [Validators.required]],
      autoTaskApprove: [false, [Validators.required]]
    });
  }

  get f() {
    return this.form.controls;
  }
  onCrossMonthChange() {

    if (this.form.value.crossMonth) {
      this.form.patchValue({
        toDay: this.form.value.fromDay -1
      });
    }
  }

  changeFromToDay() {
    if(!this.form.value.crossMonth) {
      this.form.patchValue({
        fromDay: 1,
        toDay: 30
      });
    } else {
      // When crossMonth is true, ensure toDay is greater than fromDay
      const fromDay = this.form.value.fromDay;
      const toDay = this.form.value.toDay;
      
      if (toDay <= fromDay) {
        // Find the next available day after fromDay
        const nextAvailableDay = this.daysList.find(day => day.value > fromDay);
        if (nextAvailableDay) {
          this.form.patchValue({
            toDay: nextAvailableDay.value
          });
        }
      }
    }
  }

  onFromDayChange() {
    if (this.form.value.crossMonth) {
      const fromDay = this.form.value.fromDay;
      const toDay = this.form.value.toDay;
      
      if (toDay <= fromDay) {
        // Find the next available day after fromDay
        const nextAvailableDay = this.daysList.find(day => day.value > fromDay);
        if (nextAvailableDay) {
          this.form.patchValue({
            toDay: nextAvailableDay.value
          });
        }
      }
    }
  }

  getPayrollCycle() {
    this.service.getPayrollCycle().subscribe({
      next: (res: any) => {
        this.loading = false;
        if(res.data.fromDay && res.data.toDay) {
          // Store original data for reset functionality
          this.originalData = {
            leaveSystem: res.data.leaveSystem,
            fromDay: res.data.fromDay,
            toDay: res.data.toDay,
            crossMonth: res.data.crossMonth,
            autoTaskApprove: res.data.autoTaskApprove || false
          };
          
          this.form.patchValue(this.originalData);
        }
      }
    });
  }

  resetToOriginalData() {
    if (this.originalData) {
      this.form.patchValue(this.originalData);
    }
  }
  updateCycle() {
    if (this.form.valid) 

      this.service.updatePayrollCycle(this.form.value).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.alert.showAlert(res.message, 'bg-success');
          } else {
            this.alert.showAlert(res.message, 'bg-danger');
          }
        },
        error: () => {
          this.alert.showAlert('error_updating_payroll_cycle', 'bg-danger');
        }
      });
    }
  }
