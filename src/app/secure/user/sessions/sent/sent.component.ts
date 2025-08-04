import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Subscription} from "rxjs";
import {SessionSent} from "../../../../core/interfaces/session-sent";
import {SessionSentService} from "../../../../core/services/session-sent.service";
import {LayoutWithFiltersComponent} from "../../../../core/components/layout-with-filters.component";
import {SearchComponent} from "../../../../core/filters/search.component";
import {SessionStatusFilterComponent} from "../../../../core/filters/session-status-filter.component";
import {TranslateModule} from "@ngx-translate/core";
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {NgxPaginationModule} from "ngx-pagination";
import {UserImageComponent} from "../../../../core/components/user-image.component";
import {RemainingTimeComponent} from "../../../../core/components/session-remaining-time/remaining-time.component";
import {ArabicNumbersPipe} from "../../../../core/pipes/arabic-numbers.pipe";
import {RateComponent} from "../../../../core/components/rate.component";
import {SessionStatusComponent} from "../../../../core/components/session-status/session-status.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {RouterLink} from "@angular/router";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'sent',
  standalone: true,
  imports: [CommonModule, LayoutWithFiltersComponent, SearchComponent, SessionStatusFilterComponent, TranslateModule, ArabicDatePipe, NgxPaginationModule, UserImageComponent, RemainingTimeComponent, ArabicNumbersPipe, RateComponent, SessionStatusComponent, LoadingComponent, NotFoundComponent, RouterLink],
  templateUrl: './sent.component.html',
  styleUrls: ['./sent.component.scss']
})
export class SentComponent implements OnInit, OnDestroy {
  sent: SessionSent[] = []
  loading!: boolean;
  meta: any;
  source1!: Subscription;
  source2!: Subscription;
  source3!: Subscription;
  protected readonly environment = environment;

  constructor(public service: SessionSentService) {
  }

  ngOnInit(): void {
    this.service.loading.next(true)
    this.getSent();
    this.source2 = this.service.meta.subscribe((res: any) => this.meta = res);
    this.source3 = this.service.loading.subscribe((res: any) => this.loading = res)
  }

  getSent() {
    this.source1 = this.service.sent$.subscribe((res: any) => {
      this.sent = res;
    });
  }

  filter() {
    this.service.page.next(1)
    this.service.hasChanged.next(true)
  }

  ngOnDestroy(): void {
    this.source1.unsubscribe();
    this.source2.unsubscribe();
    this.source3.unsubscribe();
  }
}
