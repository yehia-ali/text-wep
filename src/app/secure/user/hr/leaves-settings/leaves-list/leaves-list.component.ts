import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LeavesRequestsService} from "../../../../../core/services/leaves-requests.service";
import {Subscription} from "rxjs";
import {NotFoundComponent} from "../../../../../core/components/not-found.component";
import {LoadingComponent} from "../../../../../core/components/loading.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'leaves-list',
  standalone: true,
  imports: [CommonModule, NotFoundComponent, LoadingComponent, TranslateModule],
  templateUrl: './leaves-list.component.html',
  styleUrls: ['./leaves-list.component.scss']
})
export class LeavesListComponent implements OnInit, OnDestroy {
  service = inject(LeavesRequestsService);
  leaveTypes: any = [];
  source$: Subscription;
  loading = true;

  ngOnInit() {
    this.source$ = this.service.list$.subscribe((res: any) => {
      this.leaveTypes = res.data;
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
