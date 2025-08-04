import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CategoriesComponent} from "./categories.component";
import {SubCategoriesComponent} from "./sub-categories/sub-categories.component";
import {ServiceProvidersListComponent} from "./service-providers-list/service-providers-list.component";
import {UserProfileComponent} from "./user-profile/user-profile.component";

const routes: Routes = [
  {
    path: '', component: CategoriesComponent, children: [
      {path: '', component: SubCategoriesComponent, title: 'Taskedin - SessionCategories'},
      {path: ':sub-id/service-providers', component: ServiceProvidersListComponent, title: 'Taskedin - Service Providers'},
      {path: ':sub-id/service-providers/:user-id/profile', component: UserProfileComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule {
}
