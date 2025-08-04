import {Component, EventEmitter, inject, Input, OnChanges, Output} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {InfoSidebarComponent} from "../../../../core/components/info-sidebar.component";
import {TranslateModule} from "@ngx-translate/core";
import {RateComponent} from "../../../../core/components/rate.component";
import {AddRateComponent} from "../../../../core/components/add-rate/add-rate.component";
import {TaskActionsComponent} from "../../../../core/components/task-actions.component";
import {TaskDetailsService} from "../../../../core/services/task-details.service";
import {ChatService} from "../../../user/chat/chat.service";
import {Router} from "@angular/router";
import {ConfirmationMessageComponent} from "../../../../core/dialogs/confirmation-message.component";
import {MatDialog} from "@angular/material/dialog";
import {AlertService} from "../../../../core/services/alert.service";
import {MatTabsModule} from "@angular/material/tabs";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {FormControl} from "@angular/forms";
import { TaskType } from 'src/app/core/enums/task-type';
import { enumToArray } from 'src/app/core/functions/enum-to-array';
import { ArabicDatePipe } from "../../../../core/pipes/arabic-date.pipe";
import { ArabicTimePipe } from "../../../../core/pipes/arabic-time.pipe";

@Component({
  selector: 'top-section',
  standalone: true,
  imports: [CommonModule, InfoSidebarComponent, TranslateModule, RateComponent, AddRateComponent, TaskActionsComponent, MatTabsModule, NotFoundComponent, ArabicDatePipe, ArabicTimePipe],
  templateUrl: './top-section.component.html',
  styleUrls: ['./top-section.component.scss']
})
export class TopSectionComponent implements OnChanges {
  @Input() details!: any;
  @Input() withActions = true;
  @Input() data = true;
  @Input() taskId :any;
  @Output() rateAdded  = new EventEmitter();

  history: any[] = [];
  logs: any[] = [];
  taskType: any = enumToArray(TaskType)
  historyIsOpen = false;
  service = inject(TaskDetailsService)
  chatSer = inject(ChatService)
  router = inject(Router)
  dialog = inject(MatDialog)
  alert = inject(AlertService)
  selected = new FormControl(0)
  creator: boolean;
  taskTypeValue:any
  canUpdateRate: boolean;

  ngOnChanges(changes: any): void {
    if (changes.details) {
      this.selected.setValue(0)
    }
  }
  constructor(private datePipe : DatePipe){}
  ngOnInit(){
    if(this.details.taskGroupCreatorId == localStorage.getItem('id')){
      this.creator = true
    }else{
      this.creator = false
    }
    this.taskTypeValue =  this.taskType.find((item:any) => item.value == this.details?.taskGroupType)?.name
    let taskDate:any = this.datePipe.transform(new Date(this.details.rateDate).setMinutes(new Date(this.details.rateDate).getMinutes() + 10), 'yyyy-MM-ddTHH:mm:ss');
    let date:any = this.datePipe.transform(new Date() , 'yyyy-MM-ddTHH:mm:ss' , "UTC")

    if (date < taskDate) {
      this.canUpdateRate = true;
    } else {
      this.canUpdateRate = false;
    }
  }

  getHistory() {
    this.service.getTaskLog(this.taskId).subscribe((res:any) => {
    })
    this.service.getTaskHistory(this.taskId).subscribe((res:any) => {
      this.history = res.data
    })
    this.historyIsOpen = false;
    setTimeout(() => {
      this.historyIsOpen = true;
    }, 0);
  }

  chat() {
    this.service.getOrCreateChat(this.details.taskGroupId).subscribe((res: any) => {
      this.chatSer.roomId.next(res.data.taskGroupChatId);
      this.chatSer.getRoomChat(true);
      this.router.navigate(['/chat'])
    })
  }

  cancel(id: number) {
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      autoFocus: false,
      data: {
        message: 'cancel_task',
        btn_name: "continue",
        classes: 'bg-primary white'
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.service.cancelTask(id).subscribe((res: any) => {
          if (res.success) {
            this.service.hasChanged.next(true);
            this.alert.showAlert('task_canceled')
          }
        });
      }
    });
  }

  delete(taskId: number, taskGroupId: number) {
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      autoFocus: false,
      data: {
        message: 'delete_task',
        btn_name: "delete",
        classes: 'bg-primary white'
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.service.deleteTask({taskId, taskGroupId}).subscribe((res: any) => {
          if (res.success) {
            this.alert.showAlert('task_deleted');
            this.router.navigate(['/tasks/sent'])
          }
        })
      }
    });
  }

  close(){
    this.dialog.closeAll()
  }
}
