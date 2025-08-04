import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {VoteInboxService} from "../../../../core/services/vote-inbox.service";
import {Subscription} from "rxjs";
import {VoteInbox} from "../../../../core/interfaces/vote-inbox";
import {LayoutWithFiltersComponent} from "../../../../core/components/layout-with-filters.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgxPaginationModule} from "ngx-pagination";
import {PriorityComponent} from "../../../../core/components/priority.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {UserImageComponent} from "../../../../core/components/user-image.component";
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {TimeLeftComponent} from "../../../../core/components/time-left.component";
import {RouterModule} from "@angular/router";
import {InboxFiltersComponent} from "./inbox-filters/inbox-filters.component";
import {VoteStatusComponent} from "../../../../core/components/vote-status.component";

@Component({
  selector: 'inbox',
  standalone: true,
  imports: [CommonModule, NotFoundComponent, LoadingComponent, LayoutWithFiltersComponent, TranslateModule, NgxPaginationModule, PriorityComponent, MatTooltipModule, UserImageComponent, ArabicDatePipe, TimeLeftComponent, RouterModule, InboxFiltersComponent, VoteStatusComponent],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit, OnDestroy {
  service = inject(VoteInboxService);
  inbox: VoteInbox[] = [];
  meta: any;
  loading = true;
  source1$!: Subscription;

  ngOnInit() {
    this.service.loading.subscribe(res => this.loading = res);
    this.service.meta.subscribe(res => this.meta = res);
    this.source1$ = this.service.inbox$.subscribe(res => this.inbox = res);
  }

  trackBy(index: any, item: any) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.source1$?.unsubscribe();
    this.service.loading.next(true)
  }
}
