import {Component, inject, OnInit} from '@angular/core';
import {SpacesService} from "../../../core/services/spaces.service";
import {RolesService} from "../../../core/services/roles.service";

@Component({
  selector: 'hr-module',
  templateUrl: './hr.component.html',
  styleUrls: ['./hr.component.scss']
})
export class HrComponent implements OnInit {
  rolesSer = inject(RolesService);
  spaceService = inject(SpacesService);
  sidebarList: any;
  defaultList = [
    {img: 'assets/images/sub-sidebar/configuration.svg', link: 'space-configuration', title: 'space_configuration', roles: ['can-access-admin'], excludeRoles: ['taskedin-super-admin']},
    {img: 'assets/images/sub-sidebar/attendance.svg', link: 'attendance', title: 'my_attendance', excludeRoles: ['taskedin-super-admin']},
    {img: 'assets/images/sub-sidebar/attendance.svg', link: 'my-all-attendance', title: 'my_all_attendance', excludeRoles: ['taskedin-super-admin']},
    {img: 'assets/images/sub-sidebar/team-attendance.svg', link: 'team-attendance', title: 'team_attendance', roles: ['manager', 'can-access-admin']},
    {img: 'assets/images/sub-sidebar/attendance.svg', link: 'users-attendance', title: 'users_attendance', roles: ['can-access-admin']},
    {img: 'assets/images/sub-sidebar/attendance.svg', link: 'user-attendance', title: 'user_attendance', roles: ['can-access-admin']},
    // {img: 'assets/images/sub-sidebar/shifts.svg', link: 'shifts', title: 'shifts', roles: ['can-access-admin'], excludeRoles: ['taskedin-super-admin']},
    {img: 'assets/images/sub-sidebar/timesheet-list.svg', link: 'timesheet', title: 'timesheet', excludeRoles: ['taskedin-super-admin']},
    {img: 'assets/images/sub-sidebar/team-timesheet.svg', link: 'team-timesheet', title: 'team_timesheet', roles: ['manager'], excludeRoles: ['taskedin-super-admin']},
    {img: 'assets/images/sub-sidebar/overtime.svg', link: 'overtime', title: 'overtime', excludeRoles: ['taskedin-super-admin']},
    {img: 'assets/images/sub-sidebar/overtime-request.svg', link: 'overtime-requests', title: 'overtime_requests', roles: ['manager']},
    {img: 'assets/images/sub-sidebar/penalties.svg', link: 'penalties', title: 'penalties', roles: ['can-access-admin']},
    {img: 'assets/images/sub-sidebar/contracts.svg', link: 'contracts', title: 'contracts', roles: ['can-access-admin']},
    {img: 'assets/images/sub-sidebar/my-payslip.svg', link: 'my-payslip', title: 'my_payslip', excludeRoles: ['taskedin-super-admin']},
    {img: 'assets/images/sub-sidebar/team-payslip.svg', link: 'team-payslip', title: 'team_payslip', roles: ['can-access-admin']},
    {img: 'assets/images/sub-sidebar/payslip-history.svg', link: 'payslip-history', title: 'payslip_history', roles: ['can-access-admin']},
    {img: 'assets/images/sub-sidebar/configuration.svg', link: 'employees', title: 'employees', roles: ['can-access-admin'], excludeRoles: ['taskedin-super-admin']},
    {img: 'assets/images/sub-sidebar/configuration.svg', link: 'rates', title: 'rate', roles: ['can-access-admin'], excludeRoles: ['taskedin-super-admin']},
    {img: 'assets/images/sub-sidebar/leave-requests.svg', link: 'leaves-requests', title: 'leaves_requests', roles: ['manager'], excludeRoles: ['taskedin-super-admin']},
    {img: 'assets/images/sub-sidebar/leave.svg', link: 'leave-dashboard', title: 'leave_dashboard', excludeRoles: ['taskedin-super-admin']},
    {img: 'assets/images/sub-sidebar/leave.svg', link: 'team-balance', title: 'team_balance', roles: ['can-access-admin', 'manager'], excludeRoles: ['taskedin-super-admin']},

    // {img: 'assets/images/sub-sidebar/configuration.svg', link: 'leaves-settings', title: 'leaves_settings', roles: ['can-access-admin'], excludeRoles: ['taskedin-super-admin']},
  ]

  ngOnInit() {
    this.spaceService.spaceConfiguration$.subscribe(res => {
      if (!!res && res.leaveSystem) {
        this.sidebarList = [
          ...this.defaultList,
        ];
      } else {
        this.sidebarList = this.defaultList;
      }
    })
  }

}
