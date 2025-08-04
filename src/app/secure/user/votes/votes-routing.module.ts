import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {VotesComponent} from "./votes.component";
import {InboxComponent} from "./inbox/inbox.component";
import {SentComponent} from "./sent/sent.component";
import {DetailsComponent} from "./details/details.component";
import {VoteReportComponent} from "./vote-report/vote-report.component";

const routes: Routes = [
  {
    path: '', component: VotesComponent, children: [
      {path: 'inbox', component: InboxComponent, title: 'Taskedin - Vote-Inbox'},
      {path: 'inbox/:id', component: DetailsComponent, title: 'Taskedin - Vote-Details'},
      {path: 'sent', component: SentComponent, title: 'Taskedin - Vote-Sent'},
      {path: 'sent/:id', component: DetailsComponent, title: 'Taskedin - Vote-Details'},
      {path: 'details/:id', component: DetailsComponent, title: 'Taskedin - Vote-Details'},
      {path: 'report/:id', component: VoteReportComponent, title: 'Taskedin - Vote-Report'},
      {path: '', redirectTo: 'inbox', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VotesRoutingModule {
}
