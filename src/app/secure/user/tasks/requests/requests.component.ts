import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from "../../../../core/components/layout.component";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {PriorityComponent} from "../../../../core/components/priority.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {UserImageComponent} from "../../../../core/components/user-image.component";
import {TranslateModule} from "@ngx-translate/core";
import {AlertService} from "../../../../core/services/alert.service";
import {ChatService} from "../../chat/chat.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {TaskRequest} from "../../../../core/interfaces/task-request";
import {TaskRejectionReasonComponent} from "../../../../core/components/task-rejection-reason.component";
import {TaskRequestsService} from "../../../../core/services/task-requests.service";
import {GlobalService} from "../../../../core/services/global.service";
import {MagicScrollDirective} from "../../../../core/directives/magic-scroll.directive";
import {SelectUserDialogComponent} from "../../../../core/components/select-user-dialog/select-user-dialog.component";
import { ConfirmationMessageComponent } from 'src/app/core/dialogs/confirmation-message.component';
import { KpisService } from 'src/app/core/services/kpis.service';
import { ShowUserKpisDialogComponent } from 'src/app/core/components/show-user-kpis-dialog/show-user-kpis-dialog.component';

@Component({
  selector: 'requests',
  standalone: true,
  imports: [CommonModule, LayoutComponent, NotFoundComponent, LoadingComponent, PriorityComponent, MatTooltipModule, UserImageComponent, TranslateModule, MagicScrollDirective],
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  requests: TaskRequest[] = [];
  loading = false;
  dir = document.dir;

  constructor(private service: TaskRequestsService,private kpiServ: KpisService, private globalSer: GlobalService, private router: Router, private alert: AlertService, private dialog: MatDialog, private chatSer: ChatService) {
  }

  ngOnInit(): void {
    this.service.taskRequests.subscribe((res: any) => {
      this.requests = res;
      if (this.requests.length > 0) {
        this.loading = false;
      }
    });

    if (this.requests.length == 0) {
      this.getRequests()
    }
  }

  getRequests() {
    this.loading = true;
    this.service.getTaskRequests().subscribe(() => {
      this.loading = false;
    })
  }

  getTask(id: number) {
    this.router.navigate(['/tasks/sent/details/', id])
  }

  approveTaskRequest(id: number, taskGroupId: number , userId:any = null) {
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
          panelClass: 'confirmation-dialog',
          autoFocus: false,
          data: {
            message: 'link_kpi_to_task_message',
            btn_name: 'approve',
            classes: 'bg-primary white',
          },
    });
    dialogRef.afterClosed().subscribe((response) => {
      this.globalSer.approveOrRejectTaskRequest({id, isApproved: true}).subscribe((res: any) => {
        if (res.success) {
          this.chatSer.refreshTaskUser(taskGroupId || id).subscribe()
          this.alert.showAlert('task_approved');
          this.getRequests()
        }
      });
      if(response){
        let ref = this.dialog.open(ShowUserKpisDialogComponent, {
          width:'500px',
          data:{
            assignees:[userId],
            selectedData:null
          }
        });
        ref.afterClosed().subscribe((response) => {
          if(response){
            let data = {
              taskId: id,
              employeeKpiId: response[0].employeeKpiId
            }
            this.kpiServ.addTaskToKpi(data).subscribe((res:any) => {
              if(res.success){
                this.alert.showAlert('link_kpi_to_task_successfully');
              }
            })
          }
        })
      }
    });
  }

  rejectTaskRequest(id: any) {
    let dialogRef = this.dialog.open(TaskRejectionReasonComponent, {
      panelClass: 'confirmation-dialog',
      data: {
        id,
        btn_name: 'reject',
        redirect: false
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        let data = {
          id,
          isApproved: false,
          reason: res
        }
        this.globalSer.approveOrRejectTaskRequest(data).subscribe((res: any) => {
          if (res.success) {
            this.alert.showAlert('task_rejected');
            this.getRequests()
          }
        })
      }
    });
  }

  forward(request: TaskRequest) {
    // this.dialog.open(ForwardComponent, {
    //   data: {
    //     request,
    //   },
    //   panelClass: 'confirmation-dialog',
    // })
    let dialogRef = this.dialog.open(SelectUserDialogComponent, {
      panelClass: 'select-users-dialog',
      data: {
        selectedUsers: [],
        multi: false
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res?.changed) {
        const data = {
          assigneeId: res.users[0].id,
          taskId: request.taskId,
          taskGroupId: request.taskGroupId,
        }
        this.globalSer.forwardTask(data).subscribe((res: any) => {
          if (res.success) {
            this.alert.showAlert('task_forwarded');
            this.chatSer.refreshTaskUser(request.taskGroupId || request.taskId).subscribe()
            this.getRequests()
          }
        })
      }
    });
  }

  trackBy(index: any, item: any) {
    return item.taskId;
  }
}
