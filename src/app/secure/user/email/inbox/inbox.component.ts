import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutWithFiltersComponent} from "../../../../core/components/layout-with-filters.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {NgxPaginationModule} from "ngx-pagination";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {UserImageComponent} from "../../../../core/components/user-image.component";
import {EmailInboxService} from "../../../../core/services/email-inbox.service";
import {MatTooltipModule} from "@angular/material/tooltip";
import {Subscription} from "rxjs";
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {ArabicTimePipe} from "../../../../core/pipes/arabic-time.pipe";
import {SearchComponent} from "../../../../core/filters/search.component";

@Component({
  selector: 'inbox',
  standalone: true,
  imports: [CommonModule, LayoutWithFiltersComponent, LoadingComponent, NgxPaginationModule, NotFoundComponent, RouterLink, TranslateModule, UserImageComponent, MatTooltipModule, ArabicDatePipe, ArabicTimePipe, SearchComponent],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit, OnDestroy {
  service = inject(EmailInboxService)
  inbox: any = [];
  meta: any;
  source1$!: Subscription;

  ngOnInit(): void {
    this.source1$ = this.service.inbox$.subscribe((res: any) => {
      this.meta = this.service.meta.value;
      this.inbox = res.data.emails;
    });
  }

  trackBy(index: any, item: any) {
    return item.id;
  }

  ngOnDestroy() {
    this.source1$?.unsubscribe();
  }
}
