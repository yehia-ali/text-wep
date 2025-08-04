import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {ArabicNumbersPipe} from "../../../../core/pipes/arabic-numbers.pipe";
import {DefineDaysPipe} from "../../../../core/pipes/define-days.pipe";
import {LayoutWithFiltersComponent} from "../../../../core/components/layout-with-filters.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {MatTabsModule} from "@angular/material/tabs";
import {NgxPaginationModule} from "ngx-pagination";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {PriorityComponent} from "../../../../core/components/priority.component";
import {RepetitionComponent} from "../../../../core/components/repetition.component";
import {TaskVoteUsersComponent} from "../../../../core/components/task-vote-users.component";
import {TranslateModule} from "@ngx-translate/core";
import {Subscription} from "rxjs";
import {TaskSent} from "../../../../core/interfaces/task-sent";
import {FormControl} from "@angular/forms";
import {TaskGroupAssignee} from "../../../../core/interfaces/task-group-assignee";
import {TaskGroupReporter} from "../../../../core/interfaces/task-group-reporter";
import {MatTooltipModule} from "@angular/material/tooltip";
import {CC} from "../../../../core/interfaces/cc";
import {TaskCcService} from "../../../../core/services/task-cc.service";
import {TaskSentService} from "../../../../core/services/task-sent.service";
import {CcFiltersComponent} from "./cc-filters/cc-filters.component";
import {TaskDetailsService} from "../../../../core/services/task-details.service";
import {ChatService} from "../../chat/chat.service";
import {Router} from "@angular/router";
import { TaskGroupDetailsComponent } from "../../../../core/components/task-group-details.component";

@Component({
  selector: 'cc',
  standalone: true,
  imports: [CommonModule, ArabicDatePipe, ArabicNumbersPipe, DefineDaysPipe, LayoutWithFiltersComponent, LoadingComponent, MatTabsModule, NgxPaginationModule, NotFoundComponent, PriorityComponent, RepetitionComponent, TaskVoteUsersComponent, TranslateModule, MatTooltipModule, CcFiltersComponent, TaskGroupDetailsComponent],
  templateUrl: './cc.component.html',
  styleUrls: ['./cc.component.scss']
})
export class CcComponent implements OnInit, OnDestroy {
  cc: CC[] = [];
  service = inject(TaskCcService);
  taskDetailsSer = inject(TaskDetailsService);
  chatSer = inject(ChatService);
  router = inject(Router);
  meta: any;
  loading = true;
  source1$!: Subscription;
  source2$!: Subscription;
  source3$!: Subscription;
  lang = localStorage.getItem('language') || 'en';
  assigneesIsOpen = false;
  selectedTask!: TaskSent;
  selectedTap = new FormControl(0);
  assignees: TaskGroupAssignee[] = [];
  assigneesLoading = true;
  reporters: TaskGroupReporter[] = [];
  task: any;

  constructor(private sentSer: TaskSentService) {
  }

  ngOnInit(): void {
    this.service.loading.subscribe(res => this.loading = res);
    this.service.meta.subscribe(res => this.meta = res);
    this.service.cc$.subscribe(res => this.cc = res);
  }

  getAssignees() {
    this.selectedTap.setValue(0);
    this.assigneesIsOpen = false;
    setTimeout(() => {
      this.assigneesIsOpen = true;
    }, 0);
    this.source3$ = this.sentSer
      .getReporters(this.selectedTask?.id)
      .subscribe((res: any) => {
        this.reporters = res.data.items;
      });
  }

  chat() {
    this.taskDetailsSer.getOrCreateChat(this.selectedTask.id).subscribe((res: any) => {
      this.chatSer.roomId.next(res.data.taskGroupChatId);
      this.chatSer.getRoomChat(true);
      this.router.navigate(['/chat'])
    })
  }

  trackBy(index: any, item: any) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.source1$?.unsubscribe();
    this.source2$?.unsubscribe();
    this.source3$?.unsubscribe();
    this.service.loading.next(true)
  }
}
