import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationService } from '../../services/configuration.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { AlertService } from '../../services/alert.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputErrorComponent } from '../../inputs/input-error.component';
import { InputLabelComponent } from '../../inputs/input-label.component';
import { MatButtonModule } from '@angular/material/button';
import { SubmitButtonComponent } from '../submit-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { LeavesRequestsService } from '../../services/leaves-requests.service';
import { SelectUserComponent } from '../select-user.component';

@Component({
  selector: 'assign-leave-form',
  standalone: true,
  imports: [
    CommonModule,
    InputErrorComponent,
    InputLabelComponent,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    SubmitButtonComponent,
    TranslateModule,
    NgSelectModule,
    SelectUserComponent,
  ],
  templateUrl: './assign-leave-form.component.html',
  styleUrls: ['./assign-leave-form.component.scss'],
})
export class AssignLeaveFormComponent implements OnInit {
  service = inject(ConfigurationService);
  leaveRequestsSer = inject(LeavesRequestsService);
  leaveTypes = [];
  dialog = inject(MatDialog);
  alert = inject(AlertService);
  form!: FormGroup;
  loading = false;
  selectedUsers = [];
  selectedLeaveType: any;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AssignLeaveFormComponent>
  ) {
    this.form = this.fb.group({
      leaveTypeId: [null, Validators.required],
      balance: [0, Validators.required],
      accruals: [0, Validators.required],
    });
  }

  ngOnInit() {
    this.leaveRequestsSer
      .getLeaveTypes()
      .subscribe((res: any) => (this.leaveTypes = res.data));
    if (this.data && this.data.leaveData) {
      this.form.patchValue({
        leaveTypeId: this.data.leaveData.leaveTypeId,
        balance: this.data.leaveData.balance,
        accruals: this.data.leaveData.accruals,
      });
    }
  }

  selectType(event: any) {
    this.selectedLeaveType = event;
  }

  submit() {
    let selectedU: any[];
    if (this.data) {
      selectedU = [Number(this.data.employeeId)];
    } else {
      selectedU = this.selectedUsers.map((user: any) => user.id);
    }
    if (this.form.valid) {
      this.loading = true;
      if (this.data && this.data.leaveData) {
        let data = {
          balance: -this.data.leaveData.balance + this.form.value.balance,
          userid: Number(this.data.employeeId),
          leaveTypeId: this.data.leaveData.leaveTypeId,
        };
        this.service.updateBalance(data).subscribe((res: any) => {
          if (res.success) {
            this.alert.showAlert('balance_added');
            this.dialogRef.close(true);
          } else {
            this.loading = false;
          }
        });
      } else {
        let data = {
          ...this.form.value,
          accruals: this.form.value.balance,
          usersId: selectedU,
        };
        this.service.addBalance(data).subscribe((res: any) => {
          if (res.success) {
            this.alert.showAlert('balance_added');
            this.dialogRef.close(true);
          } else {
            this.loading = false;
          }
        });
      }
    }
  }

  getUsers(users: any) {
    this.selectedUsers = users;
  }

  get f() {
    return this.form.controls;
  }
}
