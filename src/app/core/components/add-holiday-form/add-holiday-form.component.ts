import {Component, Inject, inject} from '@angular/core';
import {CommonModule, formatDate} from '@angular/common';
import {InputErrorComponent} from "../../inputs/input-error.component";
import {InputLabelComponent} from "../../inputs/input-label.component";
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SubmitButtonComponent} from "../submit-button.component";
import {TranslateModule} from "@ngx-translate/core";
import {ConfigurationService} from "../../services/configuration.service";
import {LeavesRequestsService} from "../../services/leaves-requests.service";
import {AlertService} from "../../services/alert.service";
import {  MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ArabicNumbersPipe } from '../../pipes/arabic-numbers.pipe';
import { ArabicTextDirective } from '../../directives/arabic-text.directive';
import { EnglishTextDirective } from '../../directives/english-text.directive';

@Component({
  selector: 'add-holiday-form',
  standalone: true,
  imports: [CommonModule, InputErrorComponent, InputLabelComponent, MatButtonModule, MatDialogModule, ReactiveFormsModule, SubmitButtonComponent, TranslateModule,MatDatepickerModule,MatFormFieldModule,ArabicNumbersPipe,ArabicTextDirective,EnglishTextDirective],
  templateUrl: './add-holiday-form.component.html',
  styleUrls: ['./add-holiday-form.component.scss']
})
export class AddHolidayFormComponent {
  service = inject(ConfigurationService);
  leavesRequestService = inject(LeavesRequestsService);
  dialog = inject(MatDialog);
  alert = inject(AlertService);
  form!: FormGroup;
  loading = false;
  editMode: boolean;
  daysNumber: number = 0;
  today = new Date();

  constructor(private fb: FormBuilder,@Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = this.fb.group({
      nameEn: ['', Validators.required],
      nameAr: ['', Validators.required],
      dateFrom: ['', [Validators.required]],
      dateTo: ['', [Validators.required]],
    })
  }

  ngOnInit(){
    if(this.data){
      this.editMode = true;
      this.form.patchValue({
        nameEn:this.data.nameEn,
        nameAr:this.data.nameAr,
        dateFrom:this.data.startDate,
        dateTo:this.data.endDate,
      })
      this.daysNumber = this.data.daysNumber
    }else{
      this.editMode = false;
    }
  }
  dateChanged() {
    if(!this.form.value.dateTo){
      this.form.value.dateTo = this.form.value.dateFrom
      this.form.patchValue({
        ...this.form.value
      })
    }
    this.daysNumber = (new Date(this.form.value.dateTo).getTime() - new Date(this.form.value.dateFrom).getTime()) / (1000 * 60 * 60 * 24) + 1;
  }

  submit() {
    if (this.form.valid) {
      this.loading = true;
      if(this.editMode){
        let formData = {
          ...this.form.value,
          dateFrom: formatDate(new Date(this.form.value.dateFrom), 'YYYY-MM-dd', 'en-US'),
          dateTo: formatDate(new Date(this.form.value.dateTo), 'YYYY-MM-dd', 'en-US'),
          holidayId:this.data.id
        }
        this.service.editHoliday(formData).subscribe((res: any) => {
          if (res.success) {
            this.alert.showAlert('success')
            this.dialog.closeAll();
            this.leavesRequestService.holidaysChanged.next(true);
          } else {
            this.loading = false;
          }
        })
      }else{
        let formData = {
          ...this.form.value,
          dateFrom: formatDate(new Date(this.form.value.dateFrom), 'YYYY-MM-dd', 'en-US'),
          dateTo: formatDate(new Date(this.form.value.dateTo), 'YYYY-MM-dd', 'en-US'),
        }
        this.service.addHoliday(formData).subscribe((res: any) => {
          if (res.success) {
            this.alert.showAlert('holiday_added')
            this.dialog.closeAll();
            this.leavesRequestService.holidaysChanged.next(true);
          } else {
            this.loading = false;
          }
        })
      }
    }
  }

  get f() {
    return this.form.controls;
  }
}
