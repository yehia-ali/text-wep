import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { debounceTime, map, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLink } from '@angular/router';
import { OvertimeDashboardService } from 'src/app/core/services/overtime-dashboard.service';
import { LoadingComponent } from 'src/app/core/components/loading.component';
import { NotFoundComponent } from 'src/app/core/components/not-found.component';
import { AlertService } from 'src/app/core/services/alert.service';
import { ArabicDatePipe } from 'src/app/core/pipes/arabic-date.pipe';
import { LayoutComponent } from 'src/app/core/components/layout.component';
import { ConvertToTimePipe } from 'src/app/core/pipes/convert-to-time.pipe';
import { MagicScrollDirective } from 'src/app/core/directives/magic-scroll.directive';
import { UserWithImageComponent } from "../../../../../core/components/user-with-image/user-with-image.component";

@Component({
  selector: 'overtime-requests',
  standalone: true,
  templateUrl: './overtime-requests.component.html',
  styleUrls: ['./overtime-requests.component.scss'],
  imports: [
    CommonModule,
    LoadingComponent,
    NgxPaginationModule,
    NotFoundComponent,
    RouterLink,
    TranslateModule,
    ArabicDatePipe,
    ConvertToTimePipe,
    LayoutComponent,
    MagicScrollDirective,
    UserWithImageComponent
],
})
export class OvertimeDashboardComponent implements OnInit, OnDestroy {
  service = inject(OvertimeDashboardService);
  dialog = inject(MatDialog);
  alert = inject(AlertService);
  requests: any = [];
  meta: any;
  loading = true;

  ngOnInit() {
    this.service.loading.subscribe((res) => (this.loading = res));
    this.service.meta.subscribe((res) => (this.meta = res));
    this.service.hasChanged
      .pipe(
        debounceTime(400),
        switchMap(() => {
          this.service.loading.next(true);
          return this.service.getManagerOvertimeRequests().pipe(
            map((res: any) => {
              this.requests = res;
              this.service.loading.next(false);
            })
          );
        })
      )
      .subscribe();
  }

  trackBy(index: any, item: any) {
    return item.id;
  }

  ngOnDestroy() {
    this.service.loading.next(true);
  }
}
