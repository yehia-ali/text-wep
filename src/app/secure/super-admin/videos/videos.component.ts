import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserNavbarComponent} from "../../../core/components/user-navbar/user-navbar.component";
import {LayoutComponent} from "../../../core/components/layout.component";
import {PageInfoService} from "../../../core/services/page-info.service";
import {LoadingComponent} from "../../../core/components/loading.component";
import {NgxPaginationModule} from "ngx-pagination";
import {NotFoundComponent} from "../../../core/components/not-found.component";
import {RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {MagicScrollDirective} from "../../../core/directives/magic-scroll.directive";
import {LayoutService} from "../../../core/services/layout.service";
import {MatDialog} from "@angular/material/dialog";
import {VideosFormComponent} from "./videos-form/videos-form.component";

@Component({
  selector: 'videos',
  standalone: true,
  imports: [CommonModule, UserNavbarComponent, LayoutComponent, LoadingComponent, NgxPaginationModule, NotFoundComponent, RouterLink, TranslateModule, MagicScrollDirective],
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {
  service = inject(PageInfoService);
  layoutSer = inject(LayoutService);
  dialog = inject(MatDialog);
  videos: any;
  loading = true;

  ngOnInit() {
    this.layoutSer.withSubMenu.next(false)
    this.service.pageInfoList.subscribe(res => {
      this.videos = res;
      this.loading = false;
    })
  }

  editLink(video: any) {
    this.dialog.open(VideosFormComponent, {
      panelClass: 'large-form-dialog',
      data: {
        video
      }
    })
  }
}
