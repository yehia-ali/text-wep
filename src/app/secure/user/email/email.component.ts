import {Component, inject, OnInit} from '@angular/core';
import {UserService} from "../../../core/services/user.service";

@Component({
  selector: 'email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  userSer = inject(UserService)
  sidebarList = [
    {img: 'assets/images/sub-sidebar/inbox.svg', link: 'inbox', title: 'inbox', excludeRoles: ['taskedin-super-admin']},
    {img: 'assets/images/sub-sidebar/sent.svg', link: 'sent', title: 'sent', excludeRoles: ['taskedin-super-admin']},
    {img: 'assets/images/sub-sidebar/configuration.svg', link: 'configuration', title: 'configuration'},
  ];

  ngOnInit() {
    this.userSer.user$.subscribe(res => {
      if (res.isMailConfigured) {
        this.sidebarList = [
          {img: 'assets/images/sub-sidebar/inbox.svg', link: 'inbox', title: 'inbox', excludeRoles: ['taskedin-super-admin']},
          {img: 'assets/images/sub-sidebar/sent.svg', link: 'sent', title: 'sent', excludeRoles: ['taskedin-super-admin']},
          {img: 'assets/images/sub-sidebar/configuration.svg', link: 'configuration', title: 'configuration'},
        ];
      } else {
        this.sidebarList = [
          {img: 'assets/images/sub-sidebar/configuration.svg', link: 'configuration', title: 'configuration'},
        ]
      }
    })
  }
}
