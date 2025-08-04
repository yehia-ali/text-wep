import {Component, inject, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {NgxPaginationModule} from "ngx-pagination";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {UserImageComponent} from "../../../../core/components/user-image.component";
import {ArabicNumbersPipe} from "../../../../core/pipes/arabic-numbers.pipe";
import {FormsModule} from "@angular/forms";
import {ManagerDashboardService} from "../../../../core/services/manager-dashboard.service";
import { ConvertMinutesPipe } from "../../../../core/pipes/convert-minutes.pipe";
import { UserWithImageComponent } from "../../../../core/components/user-with-image/user-with-image.component";

@Component({
    selector: 'team-timing',
    standalone: true,
    templateUrl: './team-timing.component.html',
    styleUrls: ['./team-timing.component.scss'],
    imports: [CommonModule, TranslateModule, NgxPaginationModule, NotFoundComponent, UserImageComponent, ArabicNumbersPipe, FormsModule, ConvertMinutesPipe, UserWithImageComponent]
})
export class TeamTimingComponent implements OnInit {
  @Input() data: any;
  service = inject(ManagerDashboardService)
  meta: any;
  loading = false;
  limit = this.service.limit.value
  timeout: any;
  page = 1;

  ngOnInit() {
    this.service.meta.subscribe(res => this.meta = res);
  }

  trackBy(index: any, item: any) {
    return item.id;
  }

  pageChanged(page: any) {
    this.service.page.next(page);
    this.page = page;
    this.service.hasChanged.next(true)
    console.log(page)
  }

  changeLimit() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (this.limit < 1) {
        this.limit = 5;
      }
      this.service.limit.next(this.limit)
      this.pageChanged(1)
    }, 500)
  }
}
