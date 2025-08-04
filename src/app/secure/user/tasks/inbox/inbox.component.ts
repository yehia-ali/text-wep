import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutWithFiltersComponent} from "../../../../core/components/layout-with-filters.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgxPaginationModule} from "ngx-pagination";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {UserImageComponent} from "../../../../core/components/user-image.component";
import {TaskInboxService} from "../../../../core/services/task-inbox.service";
import {Subscription} from "rxjs";
import {Router, RouterModule} from "@angular/router";
import {PriorityComponent} from "../../../../core/components/priority.component";
import {TimeLeftComponent} from "../../../../core/components/time-left.component";
import {TaskOverdueComponent} from "../../../../core/components/task-overdue.component";
import {RateComponent} from "../../../../core/components/rate.component";
import {TaskInbox} from "../../../../core/interfaces/task-inbox";
import {RepetitionComponent} from "../../../../core/components/repetition.component";
import {TaskVoteProgressComponent} from "../../../../core/components/task-vote-progress.component";
import {TaskStatusComponent} from "../../../../core/components/task-status.component";
import {InboxFiltersComponent} from "./inbox-filters/inbox-filters.component";
import { TaskDetailsComponent } from 'src/app/secure/shared/task-details/task-details.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'inbox',
  standalone: true,
  imports: [CommonModule, LayoutWithFiltersComponent, TranslateModule, NgxPaginationModule, MatTooltipModule, NotFoundComponent, LoadingComponent, UserImageComponent, RouterModule, PriorityComponent, TimeLeftComponent, TaskOverdueComponent, RateComponent, RepetitionComponent, TaskVoteProgressComponent, TaskStatusComponent, InboxFiltersComponent],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit, OnDestroy {
  service = inject(TaskInboxService);
  inbox: TaskInbox[] = []
  meta: any;
  loading = true;
  source1$!: Subscription;
  lang = localStorage.getItem('language') || 'en'
  constructor(private dialog: MatDialog, private router: Router){}
  
  openDetails(item:any){
    this.router.navigate([], {
      queryParams: { id: item.taskId },
      queryParamsHandling: 'merge',
    });

    let dialogRef = this.dialog.open(TaskDetailsComponent,{
      data: { task: item.taskId || item},
      panelClass: 'task-details-dialog',
    })
    dialogRef.afterClosed().subscribe((res:any) => {
      // this.getTasks()
    })
  }
  ngOnInit(): void {
    this.service.loading.subscribe(res => this.loading = res);
    this.service.meta.subscribe(res => this.meta = res);
    this.source1$ = this.service.inbox$.subscribe(res => this.inbox = res);
  }

  removeUser() {
    this.service.loading.next(true)
    this.service.userName.next('');
    this.service.userInbox.next(null);
    this.service.resetFilter()
    this.service.hasChanged.next(true)
  }

  trackBy(index: any, item: any) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.source1$?.unsubscribe();
    this.service.loading.next(true)
  }
}
