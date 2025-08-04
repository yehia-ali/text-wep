import {Component} from '@angular/core';

@Component({
  selector: 'reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  sidebarList = [
    {img: 'assets/images/main-sidebar/report.svg', link: 'creators', title: 'creators'},
    {img: 'assets/images/main-sidebar/report.svg', link: 'assignees', title: 'assignees'},
    {img: 'assets/images/main-sidebar/report.svg', link: 'aggregate-report', title: 'aggregate'},
    {img: 'assets/images/sub-sidebar/report.svg', link: 'team-report', title: 'team_report', roles: ['manager']},
  ];
}
