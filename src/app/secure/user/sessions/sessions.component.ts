import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {PublicUserProfileService} from "../../../core/services/public-user-profile.service";
import {CategoriesListService} from "../../../core/services/categories.service";
import {PageInfoService} from "../../../core/services/page-info.service";

@Component({
  selector: 'sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit, OnDestroy {
  pageInfoSer = inject(PageInfoService);
  sidebarList = [
    {img: 'assets/images/sub-sidebar/categories.svg', link: 'categories', title: 'categories'},
    {img: 'assets/images/sub-sidebar/inbox.svg', link: 'inbox', title: 'inbox'},
    {img: 'assets/images/sub-sidebar/sent.svg', link: 'sent', title: 'sent'},
    {img: 'assets/images/sub-sidebar/calendar.svg', link: 'my-appointments', title: 'appointments'},
    {img: 'assets/images/sub-sidebar/profile.svg', link: 'pub-account', title: 'public_account'},
  ];

  constructor(private userProfileSer: PublicUserProfileService, private categoriesSer: CategoriesListService) {
    this.userProfileSer.getUserProfile().subscribe();
    this.categoriesSer.getCategories().subscribe();
  }

  ngOnInit() {
    this.pageInfoSer.pageInfoEnum.next('Consulting');
  }

  ngOnDestroy() {
    this.pageInfoSer.pageInfoEnum.next('');
  }
}
