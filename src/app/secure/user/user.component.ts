import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../core/services/user.service";
import {combineLatest, forkJoin, of, skip, Subscription} from "rxjs";
import {SpacesService} from "../../core/services/spaces.service";
import {GlobalService} from "../../core/services/global.service";
import {RolesService} from "../../core/services/roles.service";
import {PageInfoService} from "../../core/services/page-info.service";

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  userService = inject(UserService);
  rolesService = inject(RolesService);
  spaceService = inject(SpacesService);
  globalService = inject(GlobalService);
  pageInfoSer = inject(PageInfoService);

  source$!: Subscription;
  sidebarList: any;

  ngOnInit() {
    let isSuperAdmin = localStorage.getItem('is-super-admin');
    let spaceId = localStorage.getItem('space-id')
    this.source$ = combineLatest([!isSuperAdmin ? this.userService.getMyProfile() : of(null), !isSuperAdmin ? this.spaceService.getSpaces() : of(null), spaceId ? this.rolesService.getRoles() : of(null), this.rolesService.isTaskedinSuperAdmin(), spaceId ? forkJoin([this.globalService.getDepartments(), this.globalService.getManagers() , this.globalService.getJobTitles() , this.globalService.getPlaces(), this.globalService.getLevels()]) : of(null), !isSuperAdmin ? this.pageInfoSer.getPageInfo() : of(null), spaceId ? this.spaceService.getSpaceConfiguration() : of(null)]).subscribe();
    // this.source$ = combineLatest([!isSuperAdmin ? this.userService.getMyProfile() : of(null), !isSuperAdmin ? this.spaceService.getSpaces() : of(null), spaceId ? this.rolesService.getRoles() : of(null), this.rolesService.isTaskedinSuperAdmin(), spaceId ? this.globalService.getDepartments() : of(null), spaceId ? this.spaceService.getSpaceConfiguration() : of(null)]).subscribe();
    this.rolesService.taskedinSuperAdmin.subscribe(isTaskedinSuperAdmin => {
      this.sidebarList = [
      {img: 'assets/images/main-sidebar/departments.svg',     link: '/new-spaces',         tooltip: 'spaces',           roles: ['taskedin-super-admin']},
      {img: 'assets/images/main-sidebar/departments.svg',     link: '/all-spaces',         tooltip: 'spaces',           roles: ['taskedin-super-admin']},
      {img: 'assets/images/sub-sidebar/profile.svg',          link: '/registerd-users',    tooltip: 'registerd_users',  roles: ['taskedin-super-admin']},
      {img: 'assets/images/main-sidebar/payment.svg',         link: '/billing-orders',     tooltip: 'billing_orders',   roles: ['taskedin-super-admin']},
      {img: 'assets/images/main-sidebar/payment.svg',         link: '/packages',           tooltip: 'packages',         roles: ['taskedin-super-admin']},
      {img: 'assets/images/main-sidebar/templates.svg',       link: '/templates',          tooltip: 'templates',        roles: ['taskedin-super-admin']},
      {img: 'assets/images/main-sidebar/home.svg',            link: '/home',               tooltip: 'home',             excludeRoles: ['taskedin-super-admin']},
      {img: 'assets/images/main-sidebar/home.svg',            link: '/manager-dashboard',  tooltip: 'manager_dashboard',roles: ['can-access-admin'], excludeRoles: ['taskedin-super-admin']},
      {icon: 'bx-task',                                       link: '/board',              tooltip: 'tasks_board',      excludeRoles: ['taskedin-super-admin']},
      {icon: 'bx-star',                                       link: '/leader-board',       tooltip: 'leader_board',     excludeRoles: ['taskedin-super-admin'] , beta:true},
      {icon: 'bx-tachometer',                                 link: '/kpis',               tooltip: 'kpis',             excludeRoles: ['taskedin-super-admin'] , beta:true},
      {img: 'assets/images/main-sidebar/tasks.svg',           link: '/tasks',              tooltip: 'tasks',            defaultRoute: isTaskedinSuperAdmin ? '/tasks/all-tasks' : '/tasks'},
      {img: 'assets/images/sub-sidebar/team-attendance1.svg', link: '/manager-attendance', tooltip: 'team_attendance',  roles: ['can-access-admin'], excludeRoles: ['taskedin-super-admin']},
      {img: 'assets/images/main-sidebar/calendar.svg',        link: '/calendar',           tooltip: 'manager_calendar', roles: ['can-access-admin'], excludeRoles: ['taskedin-super-admin']},
      {img: 'assets/images/main-sidebar/calendar.svg',        link: '/calendar2',          tooltip: 'my_calendar'},
      {img: 'assets/images/main-sidebar/meeting.svg',         link: '/meeting',            tooltip: 'meetings',         excludeRoles: ['taskedin-super-admin']},
      {img: 'assets/images/main-sidebar/voting.svg',          link: '/votes',              tooltip: 'votes',            excludeRoles: ['taskedin-super-admin']},
      {img: 'assets/images/main-sidebar/company.svg',         link: '/company',            tooltip: 'space',            roles: ['can-access-admin'], excludeRoles: ['taskedin-super-admin']},
      {img: 'assets/images/main-sidebar/hr.svg',              link: '/hr',                 tooltip: 'hr',               defaultRoute: isTaskedinSuperAdmin ? '/hr/users-attendance' : '/hr'},
      {img: 'assets/images/main-sidebar/project.svg',         link: '/projects',           tooltip: 'projects',         excludeRoles: ['taskedin-super-admin']},
      {img: 'assets/images/main-sidebar/report.svg',          link: '/reports',            tooltip: 'reports',          roles: ['can-access-admin']},
      {img: 'assets/images/main-sidebar/videos.svg',          link: '/videos',             tooltip: 'videos',           roles: ['taskedin-super-admin']},
      {img: 'assets/images/sub-sidebar/lock.svg',             link: '/reset-account',      tooltip: 'reset_account',    roles: ['taskedin-super-admin']},
      {img: 'assets/images/main-sidebar/subscription.svg',    link: '/subscription',       tooltip: 'subscription',     roles: ['can-access-admin']},
      // {img: 'assets/images/main-sidebar/email.svg',           link: '/email',              tooltip: 'email',            excludeRoles: ['taskedin-super-admin']},
      // {img: 'assets/images/main-sidebar/calendar.svg',        link: '/calendar',           tooltip: 'calendar',         excludeRoles: ['taskedin-super-admin']},
      // {img: 'assets/images/main-sidebar/sessions.svg',        link: '/sessions',           tooltip: 'consulting',       excludeRoles: ['taskedin-super-admin']},
      // {img: 'assets/images/main-sidebar/wallet.svg',          link: '/wallet',             tooltip: 'wallet',           excludeRoles: ['taskedin-super-admin']},
      // {img: 'assets/images/main-sidebar/users.svg',           link: '/users',              tooltip: 'users',            defaultRoute: isTaskedinSuperAdmin ? '/users/all-users' : '/users'},
      ];
    })
  }

  ngOnDestroy() {
    this.source$.unsubscribe();
  }
}
