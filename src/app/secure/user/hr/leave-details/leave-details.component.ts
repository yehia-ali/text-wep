import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LeavesDetailsService} from "../../../../core/services/leaves-details.service";
import {LeavesDetails} from "../../../../core/interfaces/leaves-details";
import {LayoutComponent} from "../../../../core/components/layout.component";
import {TranslateModule} from "@ngx-translate/core";
import {TaskVoteUsersComponent} from "../../../../core/components/task-vote-users.component";
import {UserImageComponent} from "../../../../core/components/user-image.component";
import {TaskDescriptionComponent} from "../../../../core/components/task-description.component";
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {TaskWorkingHoursComponent} from "../../../../core/components/task-working-hours.component";
import {ActivatedRoute} from "@angular/router";
import {HistoryComponent} from "../../../../core/components/history.component";
import {InfoSidebarComponent} from "../../../../core/components/info-sidebar.component";
import {LeavesRequestsService} from "../../../../core/services/leaves-requests.service";
import {LeavesRejectReasonComponent} from "../../../../core/components/leaves-reject-reason.component";
import {AlertService} from "../../../../core/services/alert.service";
import {MatDialog} from "@angular/material/dialog";
import {MatMenuModule} from "@angular/material/menu";
import {ConfirmationMessageComponent} from "../../../../core/dialogs/confirmation-message.component";
import {TaskAttachmentsComponent} from "../../../../core/components/task-attachments.component";
import {ChatModule} from "../../chat/chat.module";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {MagicScrollDirective} from "../../../../core/directives/magic-scroll.directive";
import {ChatService} from "../../chat/chat.service";
import {map, switchMap} from "rxjs";

@Component({
  selector: 'leave-details',
  standalone: true,
  imports: [CommonModule, LayoutComponent, TranslateModule, TaskVoteUsersComponent, UserImageComponent, TaskDescriptionComponent, ArabicDatePipe, TaskWorkingHoursComponent, HistoryComponent, InfoSidebarComponent, MatMenuModule, TaskAttachmentsComponent, ChatModule, LoadingComponent, MagicScrollDirective],
  templateUrl: './leave-details.component.html',
  styleUrls: ['./leave-details.component.scss']
})
export class LeaveDetailsComponent implements OnInit, OnDestroy {
  service = inject(LeavesDetailsService);
  leavesRequestSer = inject(LeavesRequestsService);
  alert = inject(AlertService);
  dialog = inject(MatDialog);
  details!: LeavesDetails;
  details$ = this.service.hasChanged.pipe(switchMap(() => this.service.getRequestDetails().pipe(map((res: any) => {
    this.details = res;
    return res
  }))))
  route = inject(ActivatedRoute);
  dir = document.dir;
  historyIsOpen = false;
  chatSer = inject(ChatService)

  ngOnInit() {
    this.route.params.subscribe((res: any) => {
      this.service.id.next(res.id);
      this.service.hasChanged.next(true);
    })
  }

  cancelRequest(requestId: any) {
    let data = {
      requestId: requestId,
      status: 3,
      reason: 'canceled',
    };

    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      data: {
        message: 'cancel_leave_request',
        btn_name: 'confirm',
        classes: 'bg-danger white'
      }
    })

    dialogRef.afterClosed().subscribe(res => {
      this.leavesRequestSer.updateRequestStatus(data).subscribe((res: any) => {
        if (res.success) {
          this.service.hasChanged.next(true)
          this.alert.showAlert("leave_request_canceled")
        }
      });
    })
  }


  approveRequest(requestId: any) {
    // this.service.loading.next(true)
    let data = {
      requestId: requestId,
      status: 1,
      reason: "Approved"
    };
    this.leavesRequestSer.updateRequestStatus(data).subscribe((res: any) => {
      if (res.success) {
        this.alert.showAlert('leaves_request_approved')
        this.service.hasChanged.next(true);
      }
    })
  }

  rejectRequest(requestId: any) {
    let dialogRef = this.dialog.open(LeavesRejectReasonComponent, {
      disableClose: true,
      panelClass: 'reject-leave-dialog'
    })

    dialogRef.afterClosed().subscribe(reason => {
      if (reason) {
        let data = {
          requestId,
          status: 2,
          reason,
        };
        this.leavesRequestSer.updateRequestStatus(data).subscribe((res: any) => {
          if (res.success) {
            this.alert.showAlert('leaves_request_rejected')
            this.service.hasChanged.next(true);
          }
        })
      }
    })
  }


  getHistory() {
    this.historyIsOpen = false;
    setTimeout(() => {
      this.historyIsOpen = true;
    }, 0);
  }

  ngOnDestroy() {
    this.chatSer.roomId.next('0');
    this.chatSer.roomUsersIds.next([]);
    this.chatSer.messages$.next([]);
    this.service.gotChat.next(false);
    this.service.details.next({})
  }
}
