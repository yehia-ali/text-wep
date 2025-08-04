import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EmailComponent} from "./email.component";

const routes: Routes = [
  {
    path: '', component: EmailComponent, children: [
      {path: 'inbox', loadComponent: () => import('./inbox/inbox.component').then(m => m.InboxComponent)},
      {path: 'inbox/details/:id', loadComponent: () => import('./details/details.component').then(m => m.DetailsComponent)},
      {path: 'sent', loadComponent: () => import('./sent/sent.component').then(m => m.SentComponent)},
      {path: 'sent/details/:id', loadComponent: () => import('./details/details.component').then(m => m.DetailsComponent)},
      {path: 'configuration', loadComponent: () => import('../email/email-configuration/email-configuration.component').then(m => m.EmailConfigurationComponent)},
      {path: 'routing', loadComponent: () => import('../../../core/components/mail-routing.component').then(c => c.MailRoutingComponent)},
      {path: '', redirectTo: 'routing', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailRoutingModule {
}
