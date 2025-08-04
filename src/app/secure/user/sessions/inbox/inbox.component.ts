import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutWithFiltersComponent} from "../../../../core/components/layout-with-filters.component";
import {combineLatest, Subscription} from "rxjs";
import {SessionInboxService} from "../../../../core/services/session-inbox.service";
import {SessionInbox} from "../../../../core/interfaces/session-inbox";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {UserImageComponent} from "../../../../core/components/user-image.component";
import {ArabicNumbersPipe} from "../../../../core/pipes/arabic-numbers.pipe";
import {RateComponent} from "../../../../core/components/rate.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {SearchComponent} from "../../../../core/filters/search.component";
import {NgxPaginationModule} from "ngx-pagination";
import {SessionStatusFilterComponent} from "../../../../core/filters/session-status-filter.component";
import {RemainingTimeComponent} from "../../../../core/components/session-remaining-time/remaining-time.component";
import {SessionStatusComponent} from "../../../../core/components/session-status/session-status.component";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'inbox',
  standalone: true,
  imports: [CommonModule, LayoutWithFiltersComponent, TranslateModule, RouterLink, ArabicDatePipe, UserImageComponent, ArabicNumbersPipe, RateComponent, LoadingComponent, NotFoundComponent, SearchComponent, NgxPaginationModule, SessionStatusFilterComponent, RemainingTimeComponent, SessionStatusComponent],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit, OnDestroy {
  mySessions: SessionInbox[] = []
  loading = true;
  meta: any;
  source$!: Subscription;
  protected readonly String = String;
  protected readonly environment = environment;

  constructor(public service: SessionInboxService) {
  }

  ngOnInit(): void {
    this.service.loading.next(true)
    this.source$ = combineLatest([this.service.mySessions$, this.service.meta, this.service.loading]).subscribe(([session, meta, loading]) => {
      this.mySessions = session;
      this.meta = meta;
      this.loading = loading;
    });
  }

  filter() {
    this.service.page.next(1)
    this.service.hasChanged.next(true)
  }

  ngOnDestroy(): void {
    this.source$.unsubscribe();
  }
}
