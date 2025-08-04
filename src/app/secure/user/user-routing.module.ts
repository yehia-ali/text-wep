import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from "./user.component";

const routes: Routes = [
  {
    path: '', component: UserComponent, children: [
      {path: 'home', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
      {path: 'manager-dashboard', loadComponent: () => import('./manager-dashboard/manager-dashboard.component').then(c => c.ManagerDashboardComponent)},
      {path: 'manager-attendance', loadComponent: () => import('./manager-dashboard/manager-attendance/manager-attendance.component').then(c => c.ManagerAttendanceComponent)},

      {path: 'board', loadComponent: () => import('./tasks/kanban-board/kanban-board.component').then(c => c.KanbanBoardComponent)},
      {path: 'board/template', loadComponent: () => import('./tasks/kanban-board/template-kanban-board/template-kanban-board.component').then(m => m.TemplateKanbanBoardComponent), title: 'Taskedin - Template Board'},

      {path: 'leader-board', loadComponent: () => import('./leader-board/leader-board.component').then(c => c.LeaderBoardComponent)},
      {path: 'tasks', loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule)},
      {path: 'calendar', loadComponent: () => import('./manager-calendar/calendar2.component').then(c => c.ManagerCalendarComponent)},
      {path: 'calendar2', loadComponent: () => import('./calendar2/calendar2.component').then(c => c.Calendar2Component)},
      {path: 'votes', loadChildren: () => import('./votes/votes.module').then(m => m.VotesModule)},
      {path: 'sessions', loadChildren: () => import('./sessions/sessions.module').then(m => m.SessionsModule)},
      {path: 'kpis', loadChildren: () => import('./kpis/kpis.module').then(m => m.KpisModule)},
      {path: 'wallet', loadChildren: () => import('./wallet/wallet.module').then(m => m.WalletModule)},
      {path: 'chat', loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule)},
      {path: 'hr', loadChildren: () => import('./hr/hr.module').then(m => m.HrModule)},
      {path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule)},
      {path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)},
      {path: 'company', loadChildren: () => import('./company/company.module').then(m => m.CompanyModule)},
      {path: 'reports', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)},
      {path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule)},
      {path: 'meeting', loadChildren: () => import('./meeting/meeting.module').then(m => m.MeetingModule)},
      {path: 'email', loadChildren: () => import('./email/email.module').then(m => m.EmailModule)},
      {path: 'subscription', loadChildren: () => import('./subscription/subscription.module').then(m => m.SubscriptionModule)},

      // super admin components
      {path: 'all-spaces', loadComponent: () => import('../super-admin/all-spaces/all-spaces.component').then(c => c.AllSpacesComponent)},
      {path: 'new-spaces', loadComponent: () => import('../super-admin/all-spaces-new/all-spaces-new.component').then(c => c.AllSpacesNewComponent)},
      {path: 'registerd-users', loadComponent: () => import('../super-admin/registerd-users/registerd-users.component').then(c => c.RegisterdUsersComponent)},
      {path: 'billing-orders', loadComponent: () => import('../super-admin/billing-orders/billing-orders.component').then(c => c.BillingOrdersComponent)},
      {path: 'packages', loadComponent: () => import('../super-admin/packages/packages.component').then(c => c.PackagesComponent)},
      {path: 'templates', loadComponent: () => import('../super-admin/templates/templates.component').then(c => c.GlobalTemplatesComponent)},
      {path: 'videos', loadComponent: () => import('../super-admin/videos/videos.component').then(c => c.VideosComponent)},
      {path: 'reset-account', loadComponent: () => import('../super-admin/reset-account/reset-account.component').then(c => c.ResetAccountComponent)},

      {path: '', redirectTo: 'home', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
