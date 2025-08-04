import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CompanyComponent} from "./company.component";
import {ProfileComponent} from "./profile/profile.component";
import {DepartmentsComponent} from "./departments/departments.component";
import {HierarchyComponent} from "../../shared/hierarchy/hierarchy.component";
import {RequestsComponent} from "./requests/requests.component";
import { UserHierarchyComponent } from './user-hierarchy/user-hierarchy.component';

const routes: Routes = [
  {
    path: '', component: CompanyComponent, title: 'Taskedin - Company', children: [
      {path: 'profile', component: ProfileComponent},
      {path: 'departments', component: DepartmentsComponent},
      {path: 'hierarchy', component: HierarchyComponent},
      {path: 'user-hierarchy', component: UserHierarchyComponent},
      {path: 'requests', component: RequestsComponent},
      {path: 'all-users', loadComponent: () => import('./all-users/all-users.component').then(m => m.AllUsersComponent)},
      {path: 'leaves-settings', loadComponent: () => import('../hr/leaves-settings/leaves-settings.component').then(m => m.LeavesSettingsComponent)},
      {path: 'space-configuration', loadComponent: () => import('./configuration/configuration.component').then(m => m.ConfigurationComponent)},
      {path: '', redirectTo: 'profile', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule {
}
