import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TaskDetails} from "../interfaces/task-details";
import {MatDialog} from "@angular/material/dialog";
import {AlertService} from "../services/alert.service";
import {GlobalService} from "../services/global.service";
import {TaskDetailsService} from "../services/task-details.service";
import {TranslateModule} from "@ngx-translate/core";
import {TaskRejectionReasonComponent} from "./task-rejection-reason.component";

@Component({
  selector: 'task-request-actions',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="task-request mb-2">
      <div class="flex aic gap-x-2">
        <button class="border p-1 border-danger danger flex-50 rounded-5 bold fs-16 clickable-btn" (click)="rejectTaskRequest()">{{'reject' | translate}}</button>
        <button class="border p-1 border-success flex-50 rounded-5 bold fs-16 clickable-btn bg-success" (click)="approveTaskRequest()">{{'approve' | translate}}</button>
      </div>
    </div>
  `,
  styles: []
})
export class TaskRequestActionsComponent {
  @Input() details!: TaskDetails;

  constructor(private dialog: MatDialog, private service: GlobalService, private alert: AlertService, private taskDetailsService: TaskDetailsService) {
  }

  ngOnInit(): void {
  }

  approveTaskRequest() {
    this.service.approveOrRejectTaskRequest({id: this.details.taskId, isApproved: true}).subscribe((res: any) => {
      if (res.success) {
        this.alert.showAlert('task_approved');
        this.taskDetailsService.hasChanged.next(true);
      }
    });
  }

  rejectTaskRequest() {
    let dialogRef = this.dialog.open(TaskRejectionReasonComponent, {
      panelClass: 'confirmation-dialog',
      data: {
        id: this.details.taskId,
        btn_name: 'reject',
        redirect: true
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        let data = {
          id: this.details.taskId,
          isApproved: false,
          reason: res
        }
        this.service.approveOrRejectTaskRequest(data).subscribe((res: any) => {
          if (res.success) {
            this.alert.showAlert('task_rejected');
            this.taskDetailsService.hasChanged.next(true);
          }
        })
      }
    });
  }

}
