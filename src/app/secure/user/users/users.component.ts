import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {RolesService} from "../../../core/services/roles.service";

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  sidebarList = [
    {img: 'assets/images/sub-sidebar/hierarchy.svg', link: 'hierarchy', title: 'hierarchy', excludeRoles: ['taskedin-super-admin']},
    {img: 'assets/images/sub-sidebar/report.svg', link: 'team-report', title: 'team_report', roles: ['manager']},
    {img: 'assets/images/main-sidebar/users.svg', link: 'all-users', title: 'all_users', roles: ['can-access-admin']}
  ];
  rolesSer = inject(RolesService)
  source$!: Subscription;

  ngOnInit() {
    this.source$ = this.rolesSer.isManager.subscribe((res: any) => {
      if (res) this.sidebarList.push();
    });

    this.rolesSer.isAdmin.subscribe((res: any) => {
      if (res) this.sidebarList.push();
    });
  }

  ngOnDestroy() {
    this.source$.unsubscribe();
  }
}
