import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SessionsComponent} from "./sessions.component";
import {InboxComponent} from "./inbox/inbox.component";
import {SentComponent} from "./sent/sent.component";
import {SessionDetailsComponent} from "../../shared/session-details/session-details.component";
import {MyAppointmentsComponent} from "./my-appointments/my-appointments.component";
import {UserProfileComponent} from "./categories/user-profile/user-profile.component";

const routes: Routes = [
  {
    path: '', component: SessionsComponent, children: [
      {path: 'categories', loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule), title: 'Taskedin - SessionCategories'},
      {path: 'inbox', component: InboxComponent, title: 'Taskedin - SessionInbox'},
      {path: 'inbox/:id', component: SessionDetailsComponent, title: 'Taskedin - SessionDetails'},
      {path: 'sent', component: SentComponent, title: 'Taskedin - SessionSent'},
      {path: 'sent/:id', component: SessionDetailsComponent, title: 'Taskedin - SessionDetails'},
      {path: 'my-appointments', component: MyAppointmentsComponent, title: 'Taskedin - My-Appointments'},
      {path: 'pub-account', component: UserProfileComponent, title: 'Taskedin - Public-Profile'},
      {path: '', redirectTo: 'categories', pathMatch: 'full'}
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessionsRoutingModule {
}
