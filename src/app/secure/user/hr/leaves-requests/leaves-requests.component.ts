import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutWithFiltersComponent} from "../../../../core/components/layout-with-filters.component";
import {LeavesRequestsService} from "../../../../core/services/leaves-requests.service";
import {InboxFiltersComponent} from "../../tasks/inbox/inbox-filters/inbox-filters.component";
import {SearchComponent} from "../../../../core/filters/search.component";
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
import {MatTooltipModule} from "@angular/material/tooltip";
import {debounceTime, map, switchMap} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {LeavesRejectReasonComponent} from "../../../../core/components/leaves-reject-reason.component";
import {AlertService} from "../../../../core/services/alert.service";
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {PageInfoService} from "../../../../core/services/page-info.service";

@Component({
  selector: 'leaves-requests',
  standalone: true,
  imports: [CommonModule, LayoutWithFiltersComponent, InboxFiltersComponent, SearchComponent, LoadingComponent, NgxPaginationModule, NotFoundComponent, PriorityComponent, RateComponent, RepetitionComponent, RouterLink, TaskOverdueComponent, TaskStatusComponent, TaskVoteProgressComponent, TimeLeftComponent, TranslateModule, UserImageComponent, MatTooltipModule, ArabicDatePipe],
  templateUrl: './leaves-requests.component.html',
  styleUrls: ['./leaves-requests.component.scss']
})
export class LeavesRequestsComponent implements OnInit, OnDestroy {
  service = inject(LeavesRequestsService);
  dialog = inject(MatDialog);
  alert = inject(AlertService);
  pageInfoSer = inject(PageInfoService);

  requests: any = []
  meta: any;
  loading = true;

  ngOnInit() {
    this.pageInfoSer.pageInfoEnum.next('Leaves');
    this.service.loading.subscribe(res => this.loading = res);
    this.service.meta.subscribe(res => this.meta = res);
    this.service.hasChanged.pipe(debounceTime(400), switchMap(() => {
      this.service.loading.next(true)
      return this.service.getManagerRequests().pipe(map((res: any) => {
        this.requests = res;
        this.service.loading.next(false)
      }))
    })).subscribe();
  }


  approveRequest(requestId: any) {
    // this.service.loading.next(true)
    let data = {
      requestId: requestId,
      status: 1,
      reason: "Approved"
    };
    this.service.updateRequestStatus(data).subscribe((res: any) => {
      if (res.success) {
        this.alert.showAlert('leaves_request_approved')
        this.service.hasChanged.next(true);
      }
    })
  }

  rejectRequest(requestId: any) {
    let dialogRef = this.dialog.open(LeavesRejectReasonComponent, {
      disableClose: true,
      panelClass: 'reject-leave-dialog'
    })

    dialogRef.afterClosed().subscribe(reason => {
      if (reason) {
        let data = {
          requestId,
          status: 2,
          reason,
        };
        this.service.updateRequestStatus(data).subscribe((res: any) => {
          if (res.success) {
            this.alert.showAlert('leaves_request_rejected')
            this.service.hasChanged.next(true);
          }
        })
      }
    })
  }

  trackBy(index: any, item: any) {
    return item.id;
  }

  ngOnDestroy() {
    this.service.loading.next(true);
    this.pageInfoSer.pageInfoEnum.next('');
  }
}
