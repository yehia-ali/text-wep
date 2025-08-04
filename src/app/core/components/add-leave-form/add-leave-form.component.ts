import {Component, Inject, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {InputLabelComponent} from "../../inputs/input-label.component";
import {InputErrorComponent} from "../../inputs/input-error.component";
import {MatButtonModule} from "@angular/material/button";
import {SubmitButtonComponent} from "../submit-button.component";
import {ConfigurationService} from "../../services/configuration.service";
import {AlertService} from "../../services/alert.service";
import {NgSelectModule} from "@ng-select/ng-select";
import {LeavesRequestsService} from "../../services/leaves-requests.service";
import { ArabicTextDirective } from '../../directives/arabic-text.directive';
import { EnglishTextDirective } from '../../directives/english-text.directive';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'add-leave-form',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatDialogModule, ReactiveFormsModule, InputLabelComponent, InputErrorComponent, MatButtonModule, SubmitButtonComponent, NgSelectModule, FormsModule, ArabicTextDirective, EnglishTextDirective, MatTooltipModule],
  templateUrl: './add-leave-form.component.html',
  styleUrls: ['./add-leave-form.component.scss']
})
export class AddLeaveFormComponent implements OnInit {
  service = inject(ConfigurationService);
  leaveRequestSer = inject(LeavesRequestsService);
  dialog = inject(MatDialog);
  alert = inject(AlertService);
  form!: FormGroup;
  loading = false;
  leaveType: any = true;
  constructor(private fb: FormBuilder, public translate: TranslateService, @Inject(MAT_DIALOG_DATA) public data:any) {
    this.form = this.fb.group({
      id:0,
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      isPaid: ['', Validators.required],
      isAutomaticAssign: [true],
      automaticAssignDaysCount: [null],
      needApprove: ['', Validators.required],
      requestLimit: ['', Validators.required],
    })
    if(this.data){
      this.form.patchValue({
        id:this.data.id,
        nameAr:this.data.nameAr || this.data.name,
        nameEn:this.data.nameEn || this.data.name,
        isPaid:this.data.isPaid,
        needApprove:this.data.needApprove,
        requestLimit:this.data.requestLimit,
        isAutomaticAssign:this.data.isAutomaticAssign,
        automaticAssignDaysCount:this.data.automaticAssignDaysCount,
      })
    }else{
      console.log(555);
    }
    console.log(this.data)
  }
  ngOnInit(): void {
    this.onLeaveTypeChange();
  }
  onLeaveTypeChange(){
    if(this.leaveType === true){
      this.form.get('isAutomaticAssign')?.setValue(true);
      this.form.get('automaticAssignDaysCount')?.setValidators([Validators.required]);
    }else{
      this.form.get('isAutomaticAssign')?.setValue(false);
      this.form.get('automaticAssignDaysCount')?.setValidators(null);
    }
    this.form.get('automaticAssignDaysCount')?.updateValueAndValidity();
  }
  submit() {
    if (this.form.valid) {
      this.loading = true;
      if(this.data){
        this.service.updateLeaveType(this.form.value).subscribe((res: any) => {
          if (res.success) {
            this.alert.showAlert('success')
            this.dialog.closeAll();
            this.leaveRequestSer.hasChanged.next(true);
          } else {
            this.loading = false;
          }
        })
      }else{
        this.service.addLeaves(this.form.value).subscribe((res: any) => {
          if (res.success) {
            this.alert.showAlert('leave_type_added')
            this.dialog.closeAll();
            this.leaveRequestSer.hasChanged.next(true);
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
