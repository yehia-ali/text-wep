import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageInfoService} from "../../services/page-info.service";
import {MatDialogModule} from "@angular/material/dialog";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'page-info',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <!--  youtube iframe link  -->
    <iframe width="100%" height="500" [src]="url" title="YouTube video player" frameborder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="display: block;"></iframe>
  `,
  styles: []
})
export class PageInfoComponent implements OnInit {
  service = inject(PageInfoService);
  sanitizer = inject(DomSanitizer);
  baseUrl = 'https://www.youtube.com/embed/'
  url: SafeResourceUrl;

  ngOnInit() {
    this.service.pageInfo.subscribe((data) => {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.baseUrl + data);
    })
  }

}
