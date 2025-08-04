import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UsersComponent} from "./users.component";

const routes: Routes = [
  {
    path: '', component: UsersComponent, title: 'Taskedin - Users', children: [
      {path: 'hierarchy', loadComponent: () => import('../../shared/hierarchy/hierarchy.component').then(m => m.HierarchyComponent)},
      {path: 'team-report', loadComponent: () => import('./team-report/team-report.component').then(m => m.TeamReportComponent)},
      {path: 'all-users', loadComponent: () => import('./all-users/all-users.component').then(m => m.AllUsersComponent)},

      {path: '', redirectTo: 'hierarchy', pathMatch: 'full'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {
}
