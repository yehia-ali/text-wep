import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Component, inject, OnInit } from '@angular/core';
import { LoadingComponent } from 'src/app/core/components/loading.component';
import { NotFoundComponent } from 'src/app/core/components/not-found.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { LateFormComponent } from './late-form/late-form.component';
import { AbsencesFormComponent } from './absences-form/absences-form.component';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { ConfirmationMessageComponent } from 'src/app/core/dialogs/confirmation-message.component';
import { AlertService } from 'src/app/core/services/alert.service';
import { ArabicDatePipe } from 'src/app/core/pipes/arabic-date.pipe';

@Component({
  selector: 'attendance-leave',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    LoadingComponent,
    NotFoundComponent,
    MatMenuModule,
    MatButtonModule,
    ArabicDatePipe,
  ],
  templateUrl: './attendance-leave.component.html',
  styleUrls: ['./attendance-leave.component.scss']
})
export class AttendanceLeaveComponent implements OnInit {
  service = inject(HrEmployeesService);
  role = inject(RolesService);
  dialog = inject(MatDialog);
  alert = inject(AlertService);
  translate = inject(TranslateService);
  loading = false;
  lateList: any[] = [];
  absences = [];
  loggedInUserId = localStorage.getItem('id');
  isAdmin = false;
  updateDate: any;
  constructor() {}
  ngOnInit(): void {
    this.getRoles();
    this.getLatencyPolicies();
  }
  getRoles() {
    this.role.canAccessAdmin.subscribe((res:any) => {
      this.isAdmin = res
    })
  }
  getRepetitionDisplay(type: number, value?: number): string {
    switch (type) {
      case 1:
        return this.translate.instant('no_deduction');
      case 2:
        return this.translate.instant('auto_deduction');
      case 3:
        return `${value} ${this.translate.instant('hours')}`;
      case 4:
        return `${value} ${this.translate.instant('days')}`;
      default:
        return '';
    }
  }

  getLatencyPolicies() {
    this.loading = true
    this.service.getAllLatencyPolicies().subscribe((res: any) => {  
      this.lateList = res.data.list.items;
      this.updateDate = res.data.updatedDate;
      // Sort from lowest to highest based on minsFrom
      this.lateList.sort((a, b) => (a.minsFrom || 0) - (b.minsFrom || 0));
      this.loading = false;
    });
  }
  editLatencyPolicyItem(item: any) {
   const dialogRef = this.dialog.open(LateFormComponent, {
      width: '600px',
      data: { 
        edit: true,
        data: item 
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.editLatencyPolicy(result);
      }
    });
  }
  editLatencyPolicy(data: any) {
    this.service.editLatencyPolicy(data).subscribe((res: any) => {
      if (res.success) {
        this.alert.showAlert('latency_policy_updated')
        this.getLatencyPolicies();
      }
    })
  }
  deleteLatencyPolicyItem(itemId: any) {
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'small-dialog',
      data: {
        id: itemId,
        btn_name: "confirm",
        classes: 'bg-primary white',
        message: "delete_latency_policy"
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.deleteLatencyPolicy(itemId);
      }
    })
  }
  deleteLatencyPolicy(id:any) {
    this.service.deleteLatencyPolicy(id).subscribe((res: any) => {
      if (res.success) {
        this.alert.showAlert('latency_policy_deleted')
        this.getLatencyPolicies();
      }
    })
  }
  addLatencyPolicyItem() {
    const dialogRef = this.dialog.open(LateFormComponent, {
      width: '600px',
      data: { 
        isEdit: false, 
        view: false,
        existingTiers: this.lateList // Pass existing tiers to calculate next minsFrom
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {        // Filter out null values from the result object
        const filteredResult = Object.fromEntries(
          Object.entries(result).filter(([_, value]) => value !== null)
        );
        this.addLatencyPolicy(filteredResult);
      }
    });
  }
  addLatencyPolicy(data:any) {
    this.service.addLatencyPolicy(data).subscribe((res: any) => {
      if (res.success) {
        this.alert.showAlert('latency_policy_added')
        this.getLatencyPolicies();
      }
    })
  }
  // Absence Policy
  addAbsence() {
    const dialogRef = this.dialog.open(AbsencesFormComponent, {
      width: '600px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.absences.push(result);
      }
    });
  }

  getLateCheckins() {
    this.loading = true;
    // Simulating API call delay
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
} 