import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SubscriptionComponent} from "./subscription.component";
import {DetailsComponent} from "./details/details.component";
import {HistoryComponent} from "./history/history.component";

const routes: Routes = [

  {
    path: '', component: SubscriptionComponent, children: [
      {path: '', component: DetailsComponent},
      {path: 'history', component: HistoryComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionRoutingModule {
}
