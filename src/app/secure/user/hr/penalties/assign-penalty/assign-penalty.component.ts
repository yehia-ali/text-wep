import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputErrorComponent } from 'src/app/core/inputs/input-error.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { InputLabelComponent } from 'src/app/core/inputs/input-label.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MonthFilterComponent } from 'src/app/core/filters/month-filter.component';
import { SelectUserComponent } from 'src/app/core/components/select-user.component';
import { SuccessFileUploadDialogComponent } from 'src/app/core/components/upload-file-dialog/success-file-upload-dialog/success-file-upload-dialog.component';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { PenaltiesService } from 'src/app/core/services/penalties.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { Repetition } from 'src/app/core/enums/repetition';
import { enumToArray } from 'src/app/core/functions/enum-to-array';

@Component({
  selector: 'assign-penalty',
  templateUrl: './assign-penalty.component.html',
  styleUrls: ['./assign-penalty.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    TranslateModule,
    InputErrorComponent,
    NgSelectModule,
    InputLabelComponent,
    ReactiveFormsModule,
    MonthFilterComponent,
    SelectUserComponent,
  ]
})
export class AssignPenaltyComponent implements OnInit {
  dialogRef = inject(MatDialogRef);
  dialog = inject(MatDialog)
  hrService = inject(HrEmployeesService);
  service = inject(PenaltiesService);
  data = inject(MAT_DIALOG_DATA);
  translate = inject(TranslateService);
  fb = inject(FormBuilder);
  alert = inject(AlertService);
  currentLang: string = '';
  form!: FormGroup;
  penaltyTypesList: any[] = [];
  minDate = new Date();
  selectedUser: any;
  userId: number = localStorage.getItem('id') as any;
  deductionsInfo: any;
  repetition: any[] = enumToArray(Repetition);
  constructor(
  ){
    this.currentLang = this.translate.currentLang;
  }
  ngOnInit(): void {
    this.initForm();
    this.getAllPenaltyTypes();

  }
  initForm() {
    this.form = this.fb.group({
      penaltyTypeId: [null, Validators.required],
      PenalityDate: [ new Date(), Validators.required],
      description: [''],
    });
  }
  get f() {
    return this.form.controls;
  }
  getUser(user: any) {
    this.selectedUser = user[0];
    this.userId = this.selectedUser.id;
  }
  selectMonth(event: any) {
    this.f['PenalityDate'].setValue(event.toISOString());
  }
  getAllPenaltyTypes(){
    this.hrService.getAllPenaltiesType().subscribe((res: any) => {
      this.penaltyTypesList = res.data;
    });
  }
  getLastDeduction(employeeId: any, typeId: any){
    this.service.getEmployeeLastDeduction(employeeId, typeId).subscribe((res: any) => {
      if(res){
        this.deductionsInfo = res.data;
      } else {
        this.alert.showAlert(this.translate.instant('no_deductions_found'), 'bg-danger');
      }
    });
  }
  submit() {
    if (this.form.valid) {
      const data = {
        employeeId: this.userId,
        ...this.form.value
      };
      this.service.assignPenalty(data).subscribe((res:  any) => {  
        if(res.success){
          this.dialogRef.close(data);
          this.service.loading.next(false);
          this.dialog.open(SuccessFileUploadDialogComponent, {
            width: '400px',
            data: {
              message: 'penalty_assigned_successfully',
            }
          }).afterClosed().subscribe(() => {
            this.service.loading.next(false);
            this.service.hasChanged.next(true);
            });
          } else {
            this.alert.showAlert(res.message, 'bg-danger');
          }
        });

    } 
  }
}