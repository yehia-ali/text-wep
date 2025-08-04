import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VoteSentService} from "../../../../core/services/vote-sent.service";
import {Subscription} from "rxjs";
import {VoteSent} from "../../../../core/interfaces/vote-sent";
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {InboxFiltersComponent} from "../inbox/inbox-filters/inbox-filters.component";
import {LayoutWithFiltersComponent} from "../../../../core/components/layout-with-filters.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {NgxPaginationModule} from "ngx-pagination";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {PriorityComponent} from "../../../../core/components/priority.component";
import {RouterLink} from "@angular/router";
import {TimeLeftComponent} from "../../../../core/components/time-left.component";
import {TranslateModule} from "@ngx-translate/core";
import {UserImageComponent} from "../../../../core/components/user-image.component";
import {VoteStatusComponent} from "../../../../core/components/vote-status.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {TaskVoteUsersComponent} from "../../../../core/components/task-vote-users.component";
import {ArabicNumbersPipe} from "../../../../core/pipes/arabic-numbers.pipe";
import {MatMenuModule} from "@angular/material/menu";
import {TaskVoteProgressComponent} from "../../../../core/components/task-vote-progress.component";
import {SentFiltersComponent} from "./sent-filters/sent-filters.component";
import {MatDialog} from "@angular/material/dialog";
import {AlertService} from "../../../../core/services/alert.service";
import {VoteActionsComponent} from "../vote-actions/vote-actions.component";

@Component({
  selector: 'sent',
  standalone: true,
  imports: [CommonModule, ArabicDatePipe, InboxFiltersComponent, LayoutWithFiltersComponent, LoadingComponent, NgxPaginationModule, NotFoundComponent, PriorityComponent, RouterLink, TimeLeftComponent, TranslateModule, UserImageComponent, VoteStatusComponent, MatTooltipModule, TaskVoteUsersComponent, ArabicNumbersPipe, MatMenuModule, TaskVoteProgressComponent, SentFiltersComponent, VoteActionsComponent],
  templateUrl: './sent.component.html',
  styleUrls: ['./sent.component.scss']
})
export class SentComponent implements OnInit, OnDestroy {
  service = inject(VoteSentService);
  dialog = inject(MatDialog);
  alert = inject(AlertService);
  sent: VoteSent[] = [];
  meta: any;
  loading = true;
  source1$!: Subscription;
  selectedVote!: VoteSent;
  dir: any = document.dir

  ngOnInit() {
    this.service.loading.subscribe(res => this.loading = res);
    this.service.meta.subscribe(res => this.meta = res);
    this.source1$ = this.service.sent$.subscribe(res => this.sent = res);
  }


  trackBy(index: any, item: any) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.source1$?.unsubscribe();
    this.service.loading.next(true)
  }
}
