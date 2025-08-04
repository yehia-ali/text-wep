import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrComponent } from './hr.component';

const routes: Routes = [
  {
    path: '',
    component: HrComponent,
    title: 'Taskedin - HR',
    children: [
      {
        path: 'attendance',
        loadComponent: () =>
          import('./new-attendance/new-attendance.component').then(
            (c) => c.NewAttendanceComponent
          ),
      },
      {
        path: 'my-all-attendance',
        loadComponent: () =>
          import('./attendance/attendance.component').then(
            (c) => c.AttendanceComponent
          ),
      },
      {
        path: 'team-attendance',
        loadComponent: () =>
          import('./team-attendance/team-attendance.component').then(
            (c) => c.TeamAttendanceComponent
          ),
      },
      {
        path: 'user-attendance',
        loadComponent: () =>
          import('./user-attendance/user-attendance.component').then(
            (c) => c.UserAttendanceComponent
          ),
      },
      {
        path: 'users-attendance',
        loadComponent: () =>
          import('./users-attendance/users-attendance.component').then(
            (c) => c.UsersAttendanceComponent
          ),
      },
      {
        path: 'leaves-requests',
        loadComponent: () =>
          import('./leaves-requests/leaves-requests.component').then(
            (c) => c.LeavesRequestsComponent
          ),
      },
      {
        path: 'leave-dashboard',
        loadComponent: () =>
          import('./leave-dashboard/leave-dashboard.component').then(
            (c) => c.LeaveDashboardComponent
          ),
      },
      {
        path: 'space-settings',
        loadComponent: () =>
          import('./leaves-settings/leaves-settings.component').then(
            (c) => c.LeavesSettingsComponent
          ),
      },
      {
        path: 'leaves-settings',
        loadComponent: () =>
          import('./leaves-settings/leaves-settings.component').then(
            (c) => c.LeavesSettingsComponent
          ),
      },
      {
        path: 'space-configuration',
        loadComponent: () =>
          import('./space-configuration/space-configuration.component').then(
            (c) => c.SpaceConfigurationComponent
          ),
      },
      {
        path: 'leaves-settings/space-leaves-settings',
        loadComponent: () =>
          import(
            './leaves-settings/space-configuration/space-configuration.component'
          ).then((c) => c.SpaceConfigurationComponent),
      },
      {
        path: 'leaves-requests/details/:id',
        loadComponent: () =>
          import('./leave-details/leave-details.component').then(
            (c) => c.LeaveDetailsComponent
          ),
      },
      {
        path: 'leave-dashboard/details/:id',
        loadComponent: () =>
          import('./leave-details/leave-details.component').then(
            (c) => c.LeaveDetailsComponent
          ),
      },
      {
        path: 'overtime',
        loadComponent: () =>
          import(
            './overtime/overtime-dashboard/overtime-dashboard.component'
          ).then((c) => c.OvertimeDashboardComponent),
      },
      {
        path: 'shifts',
        loadComponent: () =>
          import('./space-configuration/shifts/shifts.component').then(
            (c) => c.ShiftsComponent
          ),
      },
      {
        path: 'timesheet',
        loadComponent: () =>
          import('./timesheet-list/timesheet-list.component').then(
            (c) => c.TimesheetListComponent
          ),
      },
      {
        path: 'team-timesheet',
        loadComponent: () =>
          import('./team-timesheet/team-timesheet.component').then(
            (c) => c.TeamTimesheetComponent
          ),
      },
      {
        path: 'team-timesheet/:id',
        loadComponent: () =>
          import('./timesheet-list/timesheet-list.component').then(
            (c) => c.TimesheetListComponent
          ),
      },
      {
        path: 'overtime-requests',
        loadComponent: () =>
          import(
            './overtime/overtime-requests/overtime-requests.component'
          ).then((m) => m.OvertimeDashboardComponent),
      },
      {
        path: 'overtime/details/:id',
        loadComponent: () =>
          import('./overtime/overtime-details/overtime-details.component').then(
            (m) => m.overtimeDetailsComponent
          ),
      },
      {
        path: 'overtime-requests/details/:id',
        loadComponent: () =>
          import('./overtime/overtime-details/overtime-details.component').then(
            (m) => m.overtimeDetailsComponent
          ),
      },
      {
        path: 'penalties',
        loadComponent: () =>
          import(
            './penalties/penalties/penalties.component'
          ).then((c) => c.PenaltiesComponent),
      },
      {
        path: 'team-balance',
        loadComponent: () =>
          import('./team-balance/team-balance.component').then(
            (m) => m.TeamBalanceComponent
          ),
      },
      {
        path: 'contracts',
        loadComponent: () =>
          import('./contracts/contracts.component').then(
            (m) => m.ContractsComponent
          ),
      },
      {
        path: 'payslip-history',
        loadComponent: () =>
          import('./payslip-history/payslip-history.component').then(
            (m) => m.PayslipHistoryComponent
          ),
      },
      {
        path: 'team-payslip',
        loadComponent: () =>
          import('./team-payslip/team-payslip.component').then(
            (m) => m.TeamPayslipComponent
          ),
      },
      {
        path: 'my-payslip',
        loadComponent: () =>
          import('./my-payslip/my-payslip.component').then(
            (m) => m.MyPayslipComponent
          ),
      },
      {
        path: 'rates',
        loadComponent: () =>
          import('./employees-rate/employees-rate.component').then(
            (m) => m.EmployeesRateComponent
          ),
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./employees/employees.component').then(
            (m) => m.EmployeesComponent
          ),
        children: [
          {
            path: 'employee',
            loadComponent: () =>
              import('./employee/employee.component').then(
                (m) => m.EmployeeComponent
              ),
          },
        ],
      },

      {
        path: 'employees/employee/:id',
        loadComponent: () =>
          import('./employee/employee.component').then(
            (m) => m.EmployeeComponent
          ),
      },
      { path: '', redirectTo: 'attendance', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrRoutingModule {}
