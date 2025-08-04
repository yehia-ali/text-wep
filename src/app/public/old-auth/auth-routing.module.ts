import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthComponent} from "./auth.component";
import {RedirectComponent} from "./redirect.component";
import {ThankYouComponent} from "./thank-you.component";

const routes: Routes = [
  {
    path: '', component: AuthComponent, children: [
      {path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)},
      {path: 'register', loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)},
      {path: 'forgot-password', loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)},
      {path: 'verify-phone', loadComponent: () => import('./verify-phone/verify-phone.component').then(m => m.VerifyPhoneComponent)},
      {path: 'reset-password', loadComponent: () => import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent)},
      {path: 'redirect', component: RedirectComponent},
      {path: ':id', component: ThankYouComponent},
      {path: '', redirectTo: 'login', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
