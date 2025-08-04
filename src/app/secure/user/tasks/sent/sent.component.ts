import { Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutWithFiltersComponent } from '../../../../core/components/layout-with-filters.component';
import { LoadingComponent } from '../../../../core/components/loading.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NotFoundComponent } from '../../../../core/components/not-found.component';
import { PriorityComponent } from '../../../../core/components/priority.component';
import { RepetitionComponent } from '../../../../core/components/repetition.component';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TaskSentService } from '../../../../core/services/task-sent.service';
import { TaskSent } from '../../../../core/interfaces/task-sent';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DefineDaysPipe } from '../../../../core/pipes/define-days.pipe';
import { ArabicNumbersPipe } from '../../../../core/pipes/arabic-numbers.pipe';
import { ArabicDatePipe } from '../../../../core/pipes/arabic-date.pipe';
import { TaskActionsComponent } from '../../../../core/components/task-actions.component';
import { TaskVoteUsersComponent } from '../../../../core/components/task-vote-users.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FormControl } from '@angular/forms';
import { TaskGroupAssignee } from '../../../../core/interfaces/task-group-assignee';
import { TaskGroupReporter } from '../../../../core/interfaces/task-group-reporter';
import { MatDialog } from '@angular/material/dialog';
import { UpdateExpectedTimeComponent } from '../../../../core/dialogs/update-expected-time.component';
import { ConfirmationMessageComponent } from 'src/app/core/dialogs/confirmation-message.component';
import { AlertService } from '../../../../core/services/alert.service';
import { SentFiltersComponent } from './sent-filters/sent-filters.component';
import { TaskGroupDetailsComponent } from '../../../../core/components/task-group-details.component';
import { SelectUserDialogComponent } from '../../../../core/components/select-user-dialog/select-user-dialog.component';
import { ChatService } from '../../chat/chat.service';
import { CreateTaskComponent } from 'src/app/core/components/create-task/create-task.component';
import { HttpParams } from '@angular/common/http';
import { UserWithImageComponent } from "../../../../core/components/user-with-image/user-with-image.component";
import { enumToArray } from 'src/app/core/functions/enum-to-array';
import { PropertyTypes } from 'src/app/core/enums/propertyTypes';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'sent',
  standalone: true,
  imports: [
    CommonModule,
    LayoutWithFiltersComponent,
    LoadingComponent,
    NgxPaginationModule,
    NotFoundComponent,
    PriorityComponent,
    RepetitionComponent,
    TranslateModule,
    MatTooltipModule,
    DefineDaysPipe,
    ArabicNumbersPipe,
    ArabicDatePipe,
    TaskActionsComponent,
    TaskVoteUsersComponent,
    MatTabsModule,
    SentFiltersComponent,
    TaskGroupDetailsComponent,
    UserWithImageComponent,


],
  templateUrl: './sent.component.html',
  styleUrls: ['./sent.component.scss'],
})
export class SentComponent implements OnInit, OnDestroy {
  sent: TaskSent[] | any[] = [];
  service = inject(TaskSentService);
  meta: any;
  url = environment.apiUrl;
  loading = true;
  source1$!: Subscription;
  source2$!: Subscription;
  source3$!: Subscription;
  lang = localStorage.getItem('language') || 'en';
  assigneesIsOpen = false;
  selectedTask!: TaskSent;
  selectedTap = new FormControl(0);
  assignees: TaskGroupAssignee[] = [];
  assigneesLoading = false;
  reporters: TaskGroupReporter[] = [];
  taskAnswers: any;
  answersTypes = enumToArray(PropertyTypes)
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  answerLoading: boolean;

  searchValue: any;
  selectedIsAnswered: boolean;

  constructor(
    private dialog: MatDialog,
    private alert: AlertService,
    private chatSer: ChatService,

  ) {}

  ngOnInit(): void {
    this.service.loading.subscribe((res) => (this.loading = res));
    this.service.meta.subscribe((res) => (this.meta = res));
    this.source1$ = this.service.sent$.subscribe((res) => (this.sent = res));
  }

  openDialog(): void {
    console.log(4444);

    this.dialog.open(this.dialogTemplate,{
      panelClass: 'users-answers-dialog',
      width:'900px',
      maxHeight:'90vh',
    });
  }
  closeDialog(){
    this.dialog.closeAll()
  }
  editExpected(task: TaskSent) {
    this.dialog.open(UpdateExpectedTimeComponent, {
      panelClass: 'small-dialog',
      data: {
        task,
      },
    });
  }

  cancel(id: number) {
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      autoFocus: false,
      data: {
        message: 'cancel_task_group',
        btn_name: 'continue',
        classes: 'bg-primary white',
      },
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.service.cancelTaskGroup(id).subscribe((res: any) => {
          if (res.success) {
            this.service.hasChanged.next(true);
            this.alert.showAlert('task_group_canceled');
          }
        });
      }
    });
  }

  delete(id: number) {
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      autoFocus: false,
      data: {
        message: 'delete_task_group',
        btn_name: 'delete',
        classes: 'bg-primary white',
      },
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.service.deleteTaskGroup(id).subscribe((res: any) => {
          if (res.success) {
            this.service.hasChanged.next(true);
            this.alert.showAlert('task_group_deleted');
          }
        });
      }
    });
  }

  reassign(task: TaskSent) {
    let users: any = [];
    this.service.getAssignees(task.id).subscribe((res: any) => {
      users = res.map((user: any) => {
        return {
          id: user.assigneeId,
          name: user.assigneeName,
          imageUrl: user.assigneeProfilePicture,
          departmentId: null,
          departmentName: null,
          jobTitle: user.assigneeJob,
        };
      });
      let dialogRef = this.dialog.open(SelectUserDialogComponent, {
        panelClass: 'select-users-dialog',
        data: { selectedUsers: users, multi: true },
      });

      dialogRef.afterClosed().subscribe((res: any) => {
        if (res?.changed && res?.users?.length > 0) {
          let newUsers = res?.users;
          const data = {
            taskGroupId: task.id,
            assigneeIds: newUsers.map((user: any) => user.id),
          };
          this.service.reassign(data).subscribe((_res: any) => {
            if (_res.success) {
              this.service.hasChanged.next(true);
              this.alert.showAlert('task_group_reassigned');
              this.chatSer.refreshTaskUser(task.id).subscribe();
            }
          });
        }
      });
    });
  }

  edit(task: TaskSent) {
    let dialogRef = this.dialog.open(CreateTaskComponent, {
      disableClose: true,
      panelClass: 'create-task-dialog',
      data: { task: task, editTask: true },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if(res){
        this.service.loading.subscribe((res) => (this.loading = res));
        this.service.meta.subscribe((res) => (this.meta = res));
        this.source1$ = this.service.sent$.subscribe((res) => (this.sent = res));
      }
    });
  }

  getAssignees() {
    this.selectedTap.setValue(0);
    this.assigneesIsOpen = false;
    setTimeout(() => {
      this.assigneesIsOpen = true;
    }, 0);
    this.source3$ = this.service
      .getReporters(this.selectedTask?.id)
      .subscribe((res: any) => {
        this.reporters = res.data.items;
      });
  }

  removeUser() {
    this.service.loading.next(true);
    this.service.userName.next('');
    this.service.userSent.next(null);
    this.service.resetFilter();
    this.service.hasChanged.next(true);
  }

  ngOnDestroy(): void {
    this.source1$?.unsubscribe();
    this.source2$?.unsubscribe();
    this.source3$?.unsubscribe();
    this.service.loading.next(true);
  }
  getTaskAnswers(task: any) {
      this.openDialog();
      this.selectedTask = task;
    let params = new HttpParams().set('TaskGroup', task.headParentTaskGroupId);
    
    this.answerLoading = true;

    this.service.getTaskGroupAnswers(params).subscribe((res:any) => {
      this.answerLoading = false
      if(res.success){
        this.taskAnswers = res.data
      }
    })
  }    
}
