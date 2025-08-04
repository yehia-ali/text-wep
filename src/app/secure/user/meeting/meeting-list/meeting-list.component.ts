import {Component, inject, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InboxFiltersComponent} from "../../tasks/inbox/inbox-filters/inbox-filters.component";
import {LayoutWithFiltersComponent} from "../../../../core/components/layout-with-filters.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {NgxPaginationModule} from "ngx-pagination";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {PriorityComponent} from "../../../../core/components/priority.component";
import {RateComponent} from "../../../../core/components/rate.component";
import {RepetitionComponent} from "../../../../core/components/repetition.component";
import {RouterLink} from "@angular/router";
import {TaskOverdueComponent} from "../../../../core/components/task-overdue.component";
import {TaskStatusComponent} from "../../../../core/components/task-status.component";
import {TaskVoteProgressComponent} from "../../../../core/components/task-vote-progress.component";
import {TimeLeftComponent} from "../../../../core/components/time-left.component";
import {TranslateModule} from "@ngx-translate/core";
import {UserImageComponent} from "../../../../core/components/user-image.component";
import {TaskInbox} from "../../../../core/interfaces/task-inbox";
import {Subscription} from "rxjs";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MeetingFiltersComponent} from "./meeting-filters/meeting-filters.component";
import {MeetingService} from "../../../../core/services/meeting.service";
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {MeetingCardComponent} from "../../../../core/components/meeting-card/meeting-card.component";
import {ScheduleMeetingCardComponent} from "../../../../core/components/schedule-meeting-card/schedule-meeting-card.component";
import {PageInfoService} from "../../../../core/services/page-info.service";

@Component({
  selector: 'meeting-list',
  standalone: true,
  imports: [CommonModule, InboxFiltersComponent, LayoutWithFiltersComponent, LoadingComponent, NgxPaginationModule, NotFoundComponent, PriorityComponent, RateComponent, RepetitionComponent, RouterLink, TaskOverdueComponent, TaskStatusComponent, TaskVoteProgressComponent, TimeLeftComponent, TranslateModule, UserImageComponent, MatTooltipModule, MeetingFiltersComponent, ArabicDatePipe, MeetingCardComponent, ScheduleMeetingCardComponent],
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.scss']
})
export class MeetingListComponent implements OnDestroy {
  service = inject(MeetingService);
  inbox: TaskInbox[] = []
  meta: any;
  loading = true;
  source1$!: Subscription;
  lang = localStorage.getItem('language') || 'en'
  pageInfoSer = inject(PageInfoService);

  ngOnInit(): void {
    this.pageInfoSer.pageInfoEnum.next('Meeting');
    this.service.loading.subscribe(res => this.loading = res);
    this.service.meta.subscribe(res => this.meta = res);
    this.source1$ = this.service.inbox$.subscribe(res => this.inbox = res);
  }

  trackBy(index: any, item: any) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.pageInfoSer.pageInfoEnum.next('');
    this.source1$?.unsubscribe();
    this.service.loading.next(true)
  }
}
