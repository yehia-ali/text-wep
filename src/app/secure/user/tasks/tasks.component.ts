import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {UserService} from "../../../core/services/user.service";
import {RolesService} from "../../../core/services/roles.service";
import {PageInfoService} from "../../../core/services/page-info.service";

@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, OnDestroy{
  rolesSer = inject(RolesService);
  pageInfoSer = inject(PageInfoService);

  sidebarList = [
    // {img: 'assets/images/sub-sidebar/inbox.svg', link: 'board', title: 'board', excludeRoles: ['taskedin-super-admin']},
    {img: 'assets/images/sub-sidebar/inbox.svg', link: 'inbox', title: 'inbox', excludeRoles: ['taskedin-super-admin']},
    {img: 'assets/images/sub-sidebar/sent.svg', link: 'sent', title: 'sent', excludeRoles: ['taskedin-super-admin']},
    {img: 'assets/images/sub-sidebar/cc.svg', link: 'cc', title: 'cc', excludeRoles: ['taskedin-super-admin']},
    {img: 'assets/images/sub-sidebar/draft.svg', link: 'draft', title: 'drafts', excludeRoles: ['taskedin-super-admin']},
    {img: 'assets/images/sub-sidebar/requests.svg', link: 'requests', title: 'requests', roles: ['manager'], excludeRoles: ['taskedin-super-admin']},
    {img: 'assets/images/main-sidebar/tasks.svg', link: 'all-tasks', title: 'all_tasks', roles: ['can-access-admin']},
    {img: 'assets/images/main-sidebar/tasks.svg', link: 'templates', title: 'templates', roles: ['can-access-admin'], excludeRoles: ['taskedin-super-admin']}
    // {img: 'assets/images/sub-sidebar/calendar.svg', link: 'calendar', title: 'calendar'},
  ];

  ngOnInit() {
    this.pageInfoSer.pageInfoEnum.next('Tasking');
  }

  ngOnDestroy() {
    this.pageInfoSer.pageInfoEnum.next('');
  }
}
