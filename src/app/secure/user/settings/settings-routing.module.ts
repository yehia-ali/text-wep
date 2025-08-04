import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingsComponent} from "./settings.component";

const routes: Routes = [
  {
    path: '', component: SettingsComponent, children: [
      {path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)},
      {path: 'change-password', loadComponent: () => import('./change-password/change-password.component').then(m => m.ChangePasswordComponent)},
      {path: 'delete-account', loadComponent: () => import('./delete-account.component').then(m => m.DeleteAccountComponent)},
      {path: 'email', loadComponent: () => import('../email/email-configuration/email-configuration.component').then(m => m.EmailConfigurationComponent)},
      {path: '', redirectTo: 'profile', pathMatch: 'full'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {
}
