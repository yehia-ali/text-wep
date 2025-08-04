import { Component } from '@angular/core';

@Component({
  selector: 'kpis',
  templateUrl: './kpis.component.html',
  styleUrls: ['./kpis.component.scss']
})
export class KpisComponent {
  defaultList = [
    {icon: 'bx-line-chart',       link: 'user-kpis',  title: 'kpi',       excludeRoles: ['taskedin-super-admin']},
    {icon: 'bx-hdd',              link: 'kpis-bank',  title: 'kpis_bank', excludeRoles: ['taskedin-super-admin']},
    {icon: 'bx-group',            link: 'kpis-users', title: 'assign_kpis',     excludeRoles: ['taskedin-super-admin'] , roles: ['kpi-admin', 'can-access-admin' , 'kpi-employee']},
    {icon: 'bx-star',            link: 'rater-kpis', title: 'rate_kpis',     excludeRoles: ['taskedin-super-admin'] , roles: ['kpi-rater']},
    {icon: 'bx-group',            link: 'team-kpis', title: 'teamKpis.teamPerformanceMetrics',     excludeRoles: ['taskedin-super-admin'], roles: ['kpi-admin', 'can-access-admin' , 'kpi-employee'] },

    // {img: 'assets/images/sub-sidebar/attendance.svg',         link: 'my-all-attendance',    title: 'my_all_attendance',   excludeRoles: ['taskedin-super-admin']},
    // {img: 'assets/images/sub-sidebar/team-attendance.svg',    link: 'team-attendance',      title: 'team_attendance',     roles: ['manager', 'can-access-admin']},
    // {img: 'assets/images/sub-sidebar/attendance.svg',         link: 'users-attendance',     title: 'users_attendance',    roles: ['can-access-admin']},
    // {img: 'assets/images/sub-sidebar/attendance.svg',         link: 'user-attendance',      title: 'user_attendance',     roles: ['can-access-admin']},
    // {img: 'assets/images/sub-sidebar/timesheet-list.svg',     link: 'timesheet',            title: 'timesheet',           excludeRoles: ['taskedin-super-admin']},
    // {img: 'assets/images/sub-sidebar/team-timesheet.svg',     link: 'team-timesheet',       title: 'team_timesheet',      roles: ['manager'], excludeRoles: ['taskedin-super-admin']},
    // {img: 'assets/images/sub-sidebar/overtime.svg',           link: 'overtime',             title: 'overtime',            excludeRoles: ['taskedin-super-admin']},
    // {img: 'assets/images/sub-sidebar/overtime-request.svg',   link: 'overtime-requests',    title: 'overtime_requests',   roles: ['manager']},
    // {img: 'assets/images/sub-sidebar/contracts.svg',          link: 'contracts',            title: 'contracts',           roles: ['can-access-admin']},
    // {img: 'assets/images/sub-sidebar/my-payslip.svg',         link: 'my-payslip',           title: 'my_payslip',          excludeRoles: ['taskedin-super-admin']},
    // {img: 'assets/images/sub-sidebar/team-payslip.svg',       link: 'team-payslip',         title: 'team_payslip',        roles: ['can-access-admin']},
    // {img: 'assets/images/sub-sidebar/payslip-history.svg',    link: 'payslip-history',      title: 'payslip_history',     roles: ['can-access-admin']},
    // {img: 'assets/images/sub-sidebar/configuration.svg',      link: 'employees',            title: 'employees',           roles: ['can-access-admin'], excludeRoles: ['taskedin-super-admin']},
    // {img: 'assets/images/sub-sidebar/configuration.svg',      link: 'rates',                title: 'rate',                roles: ['can-access-admin'], excludeRoles: ['taskedin-super-admin']},

  ]
  ngOnInit(){}
}
