import {Component, inject, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArabicDatePipe} from "../pipes/arabic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {TaskDetails} from "../interfaces/task-details";
import {SubTask} from "../interfaces/sub-task";
import {TaskSentService} from "../services/task-sent.service";
import {TaskDetailsService} from "../services/task-details.service";
import {ActivatedRoute} from "@angular/router";
import {TaskGroupDetailsComponent} from "./task-group-details.component";

@Component({
  selector: 'sub-tasks',
  standalone: true,
  imports: [CommonModule, ArabicDatePipe, TranslateModule, TaskGroupDetailsComponent],
  template: `
      <div class="sub-tasks" *ngIf="details.subTasks && details.subTasks.length > 0">
          <h4 class="mb-1">{{'subtasks' | translate}}</h4>
          <div *ngFor="let sub of details.subTasks">
              <div class="subtask-card bg-gray p-1 rounded pointer mb-2" (click)="navigateMe(sub)">
                  <h5>{{sub.title}}</h5>
                  <div class="date flex aic">
                      <div class="fs-13">{{sub.startDate | arabicDate}}</div>
                      <div class="mx-50">-</div>
                      <div class="fs-13">{{sub.endDate | arabicDate}}</div>
                  </div>
              </div>
          </div>
      </div>
      <task-group-details (close)="open = false" [isDetails]="true" [open]="open" [task]="selectedTask" [assignees]="assignees" [reporters]="reporters"></task-group-details>
  `,
  styles: []
})
export class SubTasksComponent {
  @Input() details!: TaskDetails;
  sentService = inject(TaskSentService);
  service = inject(TaskDetailsService);
  route = inject(ActivatedRoute);
  selectedTask!: SubTask;
  assignees: any;
  reporters: any;

  ngOnInit(){
    console.log(this.details);

  }

  navigateMe(sub: SubTask) {
    this.selectedTask = sub;
    this.service.getTaskGroupUserRole(sub.id).subscribe(res => {
      console.log(sub , 'sub tas');

      if (res.userRole == 7) {
        this.route.snapshot.params['id'] = res.taskId;
      } else {
        this.openSidebar(res.taskGroupId)
      }
    })
  }


  open = false;

  openSidebar(taskGroupId: number) {
    this.open = false;
    this.sentService.getAssignees(taskGroupId).subscribe((res: any) => {
      this.assignees = res;
      this.open = true;
    });
    this.sentService.getReporters(taskGroupId).subscribe((res: any) => {
      this.reporters = res.data.items;
    });
  }
}
