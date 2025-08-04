import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {LayoutWithFiltersComponent} from "../../../../core/components/layout-with-filters.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {RouterLink} from "@angular/router";
import {SearchComponent} from "../../../../core/filters/search.component";
import {TranslateModule} from "@ngx-translate/core";
import {Subscription} from "rxjs";
import {MatTooltipModule} from "@angular/material/tooltip";
import {EmailSentService} from "../../../../core/services/email-sent.service";
import {NgxPaginationModule} from "ngx-pagination";

@Component({
  selector: 'sent',
  standalone: true,
  imports: [CommonModule, ArabicDatePipe, LayoutWithFiltersComponent, LoadingComponent, NotFoundComponent, RouterLink, SearchComponent, TranslateModule, MatTooltipModule, NgxPaginationModule],
  templateUrl: './sent.component.html',
  styleUrls: ['./sent.component.scss']
})
export class SentComponent implements OnInit, OnDestroy {
  service = inject(EmailSentService)
  sent: any = [];
  meta: any;
  source1$!: Subscription;

  ngOnInit(): void {
    this.source1$ = this.service.sent$.subscribe((res: any) => {
      this.meta = this.service.meta.value;
      this.sent = res.data.emails;
    });
  }

  trackBy(index: any, item: any) {
    return item.id;
  }

  ngOnDestroy() {
    this.source1$?.unsubscribe();
  }
}
