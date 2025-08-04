import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { AlertService } from 'src/app/core/services/alert.service';
import { LoadingComponent } from 'src/app/core/components/loading.component';
@Component({
  selector: 'tasks-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule, MatRadioModule, LoadingComponent],
  templateUrl: './tasks-config.component.html',
  styleUrls: ['./tasks-config.component.scss']
})
export class TasksConfigComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(HrEmployeesService); 
  private alert = inject(AlertService);
  private translate = inject(TranslateService);
  currentLanguage = this.translate.currentLang;
  form: FormGroup;
  loading = true;
  constructor(
  ) {
  } 

  ngOnInit(): void {
    this.initForm();
    this.getTasksConfig();
  }

  initForm() {
    this.form = this.fb.group({
      leaveSystem: [false, [Validators.required]],
      fromDay: [1, [Validators.required]],
      toDay: [30, [Validators.required]],
      crossMonth: [false, [Validators.required]],
      autoTaskApprove: [false, [Validators.required]]
    });
  }
  getTasksConfig() {
    this.service.getPayrollCycle().subscribe({
      next: (res: any) => {
        this.loading = false;
          this.form.patchValue({
            leaveSystem: res.data.leaveSystem,
            autoTaskApprove: res.data.autoTaskApprove || false,  
            fromDay: res.data.fromDay,
            toDay: res.data.toDay,
            crossMonth: res.data.crossMonth
          });
        },
        error: (err: any) => {
          this.alert.showAlert(err.message, 'bg-danger');
        }
      }
    );
  }
  

  setTasksConfig() {
      this.service.updatePayrollCycle(this.form.value).subscribe((res: any) => {
        if (res.success) {
          this.alert.showAlert(res.message, 'bg-success');
        } else {
          this.alert.showAlert(res.message, 'bg-danger');
        }
      });
  }   
}  
  