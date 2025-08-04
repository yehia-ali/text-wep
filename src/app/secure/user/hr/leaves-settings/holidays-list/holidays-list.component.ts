import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoadingComponent} from "../../../../../core/components/loading.component";
import {NotFoundComponent} from "../../../../../core/components/not-found.component";
import {TranslateModule} from "@ngx-translate/core";
import {LeavesRequestsService} from "../../../../../core/services/leaves-requests.service";
import {Subscription} from "rxjs";
import {ArabicDatePipe} from "../../../../../core/pipes/arabic-date.pipe";

@Component({
  selector: 'holidays-list',
  standalone: true,
  imports: [CommonModule, LoadingComponent, NotFoundComponent, TranslateModule, ArabicDatePipe],
  templateUrl: './holidays-list.component.html',
  styleUrls: ['./holidays-list.component.scss']
})
export class HolidaysListComponent implements OnInit, OnDestroy {
  leaveRequestsSer = inject(LeavesRequestsService);
  holidays: any = [];
  source$: Subscription;
  loading = true;

  ngOnInit() {
    this.source$ = this.leaveRequestsSer.holidays$.subscribe((res: any) => {
      this.holidays = res.data;
      this.loading = false;
    });
  }

  trackBy(index: any, item: any) {
    return item.id;
  }

  ngOnDestroy() {
    this.source$.unsubscribe();
  }
}
