import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReportsComponent} from "./reports.component";

const routes: Routes = [
  {
    path: '', component: ReportsComponent, title: 'Taskedin - Reports', children: [
      {path: 'creators', loadComponent: () => import('././creators-report/creators-report.component').then(m => m.CreatorsReportComponent)},
      {path: 'assignees', loadComponent: () => import('././assignees-report/assignees-report.component').then(m => m.AssigneesReportComponent)},
      {path: 'aggregate-report', loadComponent: () => import('./aggregate-report/aggregate-report.component').then(m => m.AggregateReportComponent)},
      {path: 'team-report', loadComponent: () => import('./team-report/team-report.component').then(m => m.TeamReportComponent)},
      {path: '', redirectTo: 'creators', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {
}
