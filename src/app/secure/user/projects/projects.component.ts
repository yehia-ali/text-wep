import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {PageInfoService} from "../../../core/services/page-info.service";

@Component({
  selector: 'projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  pageInfoSer = inject(PageInfoService);
  ngOnInit() {
    this.pageInfoSer.pageInfoEnum.next('Project');
  }

  ngOnDestroy() {
    this.pageInfoSer.pageInfoEnum.next('');
  }
}
