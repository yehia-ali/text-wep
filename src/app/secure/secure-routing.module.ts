import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SecureComponent} from "./secure.component";

const routes: Routes = [
  {
    path: '', component: SecureComponent, children: [
      {path: '', loadChildren: () => import('./user/user.module').then(m => m.UserModule)},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecureRoutingModule {
}
