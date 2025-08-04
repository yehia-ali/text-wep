import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TasksComponent} from "./tasks.component";

const routes: Routes = [
  {
    path: '', component: TasksComponent, children: [
      {path: 'board', loadComponent: () => import('./kanban-board/kanban-board.component').then(m => m.KanbanBoardComponent), title: 'Taskedin - Board'},
      {path: 'inbox', loadComponent: () => import('./inbox/inbox.component').then(m => m.InboxComponent), title: 'Taskedin - TaskInbox'},
      {path: 'inbox/details/:id', loadComponent: () => import('../../shared/task-details/task-details.component').then(m => m.TaskDetailsComponent), title: 'Taskedin - TaskDetails'},
      {path: 'sent', loadComponent: () => import('./sent/sent.component').then(m => m.SentComponent), title: 'Taskedin - TaskSent'},
      {path: 'sent/details/:id', loadComponent: () => import('../../shared/task-details/task-details.component').then(m => m.TaskDetailsComponent), title: 'Taskedin - TaskDetails'},
      {path: 'cc', loadComponent: () => import('./cc/cc.component').then(m => m.CcComponent), title: 'Taskedin - CC'},
      {path: 'cc/details/:id', loadComponent: () => import('../../shared/task-details/task-details.component').then(m => m.TaskDetailsComponent), title: 'Taskedin - TaskDetails'},
      {path: 'requests', loadComponent: () => import('./requests/requests.component').then(m => m.RequestsComponent), title: 'Taskedin - Requests'},
      {path: 'draft', loadComponent: () => import('./draft/draft.component').then(m => m.DraftComponent), title: 'Taskedin - Draft'},
      {path: 'all-tasks', loadComponent: () => import('./all-tasks/all-tasks.component').then(m => m.AllTasksComponent), title: 'Taskedin - All Tasks'},
      {path: 'details/:id', loadComponent: () => import('../../shared/task-details/task-details.component').then(m => m.TaskDetailsComponent), title: 'Taskedin - Task Details'},
      {path: 'templates', loadComponent: () => import('./templates/templates.component').then(m => m.TemplatesComponent), title: 'Taskedin - Templates'},
      {path: '', redirectTo: 'inbox', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule {
}
