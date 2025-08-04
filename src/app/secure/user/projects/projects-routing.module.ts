import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProjectsComponent} from "./projects.component";

const routes: Routes = [
  {
    path: '', component: ProjectsComponent, title: 'Taskedin - Projects', children: [
      {path: '', loadComponent: () => import('./list/list.component').then(m => m.ListComponent)},
      {path: 'tasks/:id', loadComponent: () => import('./tasks/tasks.component').then(m => m.TasksComponent)},
      {path: 'details/:id', loadComponent: () => import('./details/details.component').then(m => m.DetailsComponent)},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {
}
