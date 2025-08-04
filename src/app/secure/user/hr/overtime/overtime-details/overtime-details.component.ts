import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from 'src/app/core/components/layout.component';
import {TranslateModule} from '@ngx-translate/core';
import {UserImageComponent} from 'src/app/core/components/user-image.component';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {HistoryComponent} from 'src/app/core/components/history.component';
import {OvertimeService} from 'src/app/core/services/overtime.service';
import {AlertService} from 'src/app/core/services/alert.service';
import {MatDialog} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {ConfirmationMessageComponent} from 'src/app/core/dialogs/confirmation-message.component';
import {ChatModule} from 'src/app/secure/user/chat/chat.module';
import {LoadingComponent} from 'src/app/core/components/loading.component';
import {MagicScrollDirective} from 'src/app/core/directives/magic-scroll.directive';
import {ChatService} from 'src/app/secure/user/chat/chat.service';
import {InfoSidebarComponent} from 'src/app/core/components/info-sidebar.component';
import {ArabicDatePipe} from 'src/app/core/pipes/arabic-date.pipe';
import {ReasonComponent} from 'src/app/core/components/reason.component';
import {ConvertToTimePipe} from 'src/app/core/pipes/convert-to-time.pipe';
import { UserWithImageComponent } from "../../../../../core/components/user-with-image/user-with-image.component";

@Component({
  selector: 'overtime-details',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    TranslateModule,
    UserImageComponent,
    HistoryComponent,
    MatMenuModule,
    ChatModule,
    LoadingComponent,
    MagicScrollDirective,
    InfoSidebarComponent,
    ArabicDatePipe,
    ConvertToTimePipe,
    RouterModule,
    UserWithImageComponent
],
  templateUrl: './overtime-details.component.html',
  styleUrls: ['./overtime-details.component.scss'],
})
export class overtimeDetailsComponent implements OnInit, OnDestroy {


  alert = inject(AlertService);
  dialog = inject(MatDialog);
  service = inject(OvertimeService);
  details!: any;
  route = inject(ActivatedRoute);
  dir = document.dir;
  historyIsOpen = false;
  chatSer = inject(ChatService);
  histories: any[];
  currentUser = parseInt(localStorage.getItem('id') || '');
  isEmployee = false;
  isManager = false;
  acceptedHours: any
  disableBtn: boolean;

  ngOnInit() {
    this.route.params.subscribe((res: any) => {
      this.service.loading.next(true);
      this.service.detailsId$.next(res.id);
      this.service.hasChanged.next(true);
    })
    this.service.details$.subscribe((res: any) => {
      this.details = res;
      this.service.chatLoading.next(false);
      this.service.gotChat.next(true)
      this.service.loading.next(false);
      this.acceptedHours = this.details.overTimeHoursRequsted
      this.service.getHistory(this.details.id).subscribe((history: any) => {
        this.histories = history;
      });
      if (this.details.managerId == this.currentUser) {
        this.isManager = true;
        this.isEmployee = false;
      } else {
        this.isManager = false;
        this.isEmployee = true;
      }
    });
  }

  cancelRequest() {
    let data = {
      id: this.details.id,
    };

    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      data: {
        message: 'cancel_overtime_request',
        btn_name: 'confirm',
        classes: 'bg-danger white',
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.service.overtimeCancel(data).subscribe((respone: any) => {
          this.service.hasChanged.next(true)
          this.alert.showAlert('overtime_request_canceled', 'bg-success');
        })
      }
    });
  }

  approveRequest() {
    let approveReason = ''
    let dialogRef

    if (this.acceptedHours == this.details.overTimeHoursRequsted) {
      dialogRef = this.dialog.open(ConfirmationMessageComponent, {
        panelClass: 'confirmation-dialog',
        data: {
          message: 'approve_overtime_request',
          btn_name: 'confirm',
          classes: 'bg-primary white',
        },
      });
    } else {
      dialogRef = this.dialog.open(ReasonComponent, {
        disableClose: true,
        panelClass: 'approve-dialog',
        data: {
          title: 'approve',
          subTitle: 'note',
          btnTitle: 'approve',
          btnColor: 'bg-primary white'
        }
      })
    }

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        approveReason = res;
        let data = {
          requestId: this.details.id,
          approveReason: approveReason,
          approvedHours: this.acceptedHours
        };
        this.service.overtimeApprove(data).subscribe((respone: any) => {
         if(respone.success){
            this.service.hasChanged.next(true);
            this.alert.showAlert('overtime_request_approved', 'bg-success');
          }else{
           this.alert.showAlert(respone.message, 'bg-success');

         }
        })
      }
    });
  }

  rejectRequest(requestId: any) {
    let dialogRef = this.dialog.open(ReasonComponent, {
      disableClose: true,
      panelClass: 'reason-dialog',
      data: {
        title: 'rejected',
        subTitle: 'rejection_reason',
        btnTitle: 'reject_request',
        btnColor: 'bg-primary white'
      }
    })

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {

        let data = {
          requestId: this.details.id,
          rejecttionReason: res,
        };
        this.service.overtimeReject(data).subscribe((response: any) => {
          if (response.success) {

            this.service.hasChanged.next(true);
            this.alert.showAlert('overtime_request_rejected', 'bg-success');
          }
        })
      }
    });
  }

  getHistory() {
    this.historyIsOpen = false;
    setTimeout(() => {
      this.historyIsOpen = true;
    }, 0);
  }

  increaseTime() {
    this.acceptedHours += 0.25
    if (this.acceptedHours  <= 0.5) {
      this.disableBtn = true
    }else{
      this.disableBtn = false
    }
  }

  decreaseTime() {
    this.acceptedHours -= 0.25
    console.log(this.acceptedHours)
    if (this.acceptedHours  <= 0.5) {
      this.disableBtn = true
      this.acceptedHours = 0.5
    }else{
      this.disableBtn = false
    }
  }

  ngOnDestroy() {
    this.chatSer.roomId.next('0');
    this.chatSer.roomUsersIds.next([]);
    this.chatSer.messages$.next([]);
    this.service.gotChat.next(false);
    this.chatSer.newRoomCreated.next(false);
  }
}
