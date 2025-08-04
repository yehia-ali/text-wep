import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {PageInfoService} from "../../../core/services/page-info.service";

@Component({
  selector: 'votes',
  templateUrl: './votes.component.html',
  styleUrls: ['./votes.component.scss']
})
export class VotesComponent implements OnDestroy, OnInit {
  pageInfoSer = inject(PageInfoService);

  sidebarList = [
    {img: 'assets/images/sub-sidebar/inbox.svg', link: 'inbox', title: 'inbox'},
    {img: 'assets/images/sub-sidebar/sent.svg', link: 'sent', title: 'sent'},
  ]

  ngOnInit() {
    this.pageInfoSer.pageInfoEnum.next('Voting');
  }

  ngOnDestroy() {
    this.pageInfoSer.pageInfoEnum.next('');
  }
}
