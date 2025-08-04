import {Component, inject, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {TaskDetailsService} from "../../services/task-details.service";
import {map, Observable, switchMap} from "rxjs";
import {TaskDetails} from "../../interfaces/task-details";
import {TopSectionComponent} from "../../../secure/shared/task-details/top-section/top-section.component";
import {MagicScrollDirective} from "../../directives/magic-scroll.directive";
import {TranslateModule} from "@ngx-translate/core";
import {TaskUsersComponent} from "../task-users.component";
import {GoogleMapsModule} from "@angular/google-maps";
import {MatButtonModule} from "@angular/material/button";
import {TaskAttachmentsComponent} from "../task-attachments.component";
import {TaskTodoComponent} from "../task-todo.component";
import {LoadingComponent} from "../loading.component";

@Component({
  selector: 'task-details-dialog',
  standalone: true,
  imports: [CommonModule, TopSectionComponent, MagicScrollDirective, TranslateModule, TaskUsersComponent, GoogleMapsModule, MatDialogModule, MatButtonModule, TaskAttachmentsComponent, TaskTodoComponent, LoadingComponent],
  templateUrl: './task-details-dialog.component.html',
  styleUrls: ['./task-details-dialog.component.scss']
})
export class TaskDetailsDialogComponent {
  service = inject(TaskDetailsService);
  details$: Observable<TaskDetails> = this.service.hasChanged.pipe(switchMap(() => this.service.getTaskDetails().pipe(map((res: any) => res))));
  dir: any = document.dir;
  options: google.maps.MapOptions = {
    // mapTypeId: 'hybrid',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: false,
    maxZoom: 25,
    minZoom: 8,
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }
}