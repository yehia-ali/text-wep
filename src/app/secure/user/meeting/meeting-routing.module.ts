import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MeetingComponent} from "./meeting.component";
import {MeetComponent} from "./meet/meet.component";
import {MeetingListComponent} from "./meeting-list/meeting-list.component";
import {TaskDetailsComponent} from "../../shared/task-details/task-details.component";
import {RecordingsComponent} from "./recordings/recordings.component";

const routes: Routes = [
  {
    path: '', component: MeetingComponent, title: 'Taskedin - Meeting', children: [
      {path: 'list', component: MeetingListComponent},
      {path: 'meet', component: MeetComponent},
      {path: 'recordings', component: RecordingsComponent},
      {path: 'list/details/:id', component: TaskDetailsComponent},

      {path: '', redirectTo: 'list', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingRoutingModule {
}
