import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PublicComponent} from "./public.component";

const routes: Routes = [
  {
    path: '', component: PublicComponent, children: [
      {path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {
}
