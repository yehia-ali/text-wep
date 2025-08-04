import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KpisComponent } from './kpis.component';
import { UserKpisComponent } from './user-kpis/user-kpis.component';
import { KpiBankComponent } from './kpi-bank/kpi-bank.component';
import { EmployeesComponent } from '../hr/employees/employees.component';
import { RaterKpisListComponent } from './rater-kpis/rater-kpis-list/rater-kpis-list.component';
import { KpiDetailsComponent } from './rater-kpis/kpi-details/kpi-details.component';
import { RaterKpisComponent } from './rater-kpis/rater-kpis.component';
import { TeamKpisComponent } from './team-kpis/team-kpis.component';

const routes: Routes = [
  {
    path: '', component: KpisComponent, children: [
      {path: '', redirectTo: 'user-kpis', pathMatch: 'full'},
      {path: 'user-kpis',   component: UserKpisComponent,             title: 'Taskedin - user Kpis'},
      {path: 'user-kpis/:id',   component: UserKpisComponent,             title: 'Taskedin - user Kpis'},
      {path: 'kpis-bank',   component: KpiBankComponent,              title: 'Taskedin - Kpis Bank'},
      {path: 'kpis-users',  component: EmployeesComponent,            title: 'Taskedin - Kpis users' , data: {kpis: true}},
      {path: 'details/:id',   component: KpiDetailsComponent,},
      {path: 'rater-kpis',  component: RaterKpisComponent ,  title: 'Taskedin - Rate users Kpis' , children:[
        {path: '',   component: RaterKpisListComponent,},
        {path: ':id',   component: KpiDetailsComponent,},
      ]},
      {path: 'team-kpis',   component: TeamKpisComponent, title: 'Taskedin - Team Kpis'},
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KpisRoutingModule {


}
