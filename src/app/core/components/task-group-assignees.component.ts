import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserImageComponent} from "./user-image.component";
import {TimeLeftComponent} from "./time-left.component";
import {TaskOverdueComponent} from "./task-overdue.component";
import {RateComponent} from "./rate.component";
import {TaskVoteProgressComponent} from "./task-vote-progress.component";
import {TaskStatusComponent} from "./task-status.component";
import {TaskGroupAssignee} from "../interfaces/task-group-assignee";
import {TranslateModule} from "@ngx-translate/core";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import { TaskSentService } from '../services/task-sent.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'task-group-assignees',
  standalone: true,
  imports: [CommonModule, UserImageComponent, TimeLeftComponent, TaskOverdueComponent, RateComponent, TaskVoteProgressComponent, TaskStatusComponent, TranslateModule, RouterLink],
  template: `

      <div class="assignees-list px-2 py-2" #assigneeslist>
      <div class="task-card relative rounded bg-gray p-1 pointer" *ngFor="let task of users" [routerLink]="isDetails ? null : isProject ? '/tasks/details/' + task.id : 'details/' + task.id" (click)="isDetails && changeId(task.id)">
          <div class="start flex aic">
              <user-image [img]="task.assigneeProfilePicture" [id]="task.assigneeId" (click)="$event.stopImmediatePropagation()"></user-image>
              <div class="user-info ml-1">
                  <p class="mb-25 fs-15">{{task.assigneeName}}</p>
                  <p class="muted fs-14">{{task.assigneeJob}}</p>
              </div>
          </div>
          <div class="end border-top mt-1 pt-1 flex aic jcsb" *ngIf="task.taskStateId != 6 && task.taskStateId != 8 && task.taskStateId != 7">
              <time-left *ngIf="!task.isOverDue && (task.taskStateId == 1 || task.taskStateId == 3)" classes="fs-14" [label]="task.timeLeftLabel" [timeLeft]="task.timeLeft" [bullet]="task.bullet"
                         [showLeft]="true"></time-left>
              <div class="overdue flex aic" *ngIf="task.isOverDue">
                  <task-overdue classes="fs-14" [endedTaskRepeatedCounter]="task.endedTaskRepeatedCounter"></task-overdue>
                  <span class="ml-50 danger fs-14">{{'overdue' | translate}}</span>
              </div>
              <rate [rate]="task.rate" *ngIf="task.taskStateId == 2" type="small"></rate>
              <task-vote-progress [progress]="task.percentage" *ngIf="task.taskStateId == 3"></task-vote-progress>
          </div>
          <div class="status">
              <task-status [state]="task.taskStateId" classes="p-1"></task-status>
          </div>
      </div>
      </div>

  `,
  styles: [`
  .assignees-list{
    max-height:100%;
    overflow:auto
  }
    .task-card {
      overflow: hidden;

      &:not(:last-of-type) {
        margin-bottom: 1rem;
      }

      .start {
        max-width: 23rem;
      }
    }

    .status {
      position: absolute;
      top: -1px;
      inset-inline-end: -1px;
    }
  `]
})
export class TaskGroupAssigneesComponent {
  @Input() tasks: TaskGroupAssignee[] = [];
  @Input() isDetails = false;
  @Input() isProject = false;
  @Input() taskGroupId :any;
  @Output() close = new EventEmitter();
  @ViewChild('assigneeslist', { static: false }) assigneesList!: ElementRef;

  limit:any = 20;
  page:any = 1 ;
  users : any[] = []
  totalItems: any;
  moreUsersStatus: boolean;
  loading: boolean;
  constructor(private route: ActivatedRoute, private router: Router , private service : TaskSentService) {
  }



  ngOnInit(){
    this.getAllAssinees()
  }

  ngAfterViewInit() {
    this.assigneesList.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
  }

  onScroll(event: any): void {
    const scrollTop = event.target.scrollTop;
    const scrollHeight = event.target.scrollHeight;
    const clientHeight = event.target.clientHeight;
    if ((scrollTop + clientHeight + 10) >= scrollHeight && this.moreUsersStatus) {
      this.page += 1
      this.getAllAssinees()
      setTimeout(() => {
        this.moreUsersStatus = false
      }, 0);
    }
  }


  getAllAssinees(){
    this.loading = true
    let params = new HttpParams().set('id' ,this.taskGroupId).set('page' , this.page).set('limit' , this.limit)
    this.service.getAllAssignees(params).subscribe((res:any) => {
      this.loading = false
      res.items.forEach((user:any) => {
        this.users.push(user)
      });
      this.totalItems = res.totalItems
        if(this.page >= (this.totalItems / this.limit)){
          this.moreUsersStatus = false
        }else{
          this.moreUsersStatus = true
        }
    })
  }

  changeId(newId: any) {
    // Get the current URL path (excluding protocol and domain)
    const currentUrl = window.location.pathname;

    // Split the URL by '/'
    const urlParts = currentUrl.split('/');

    // Get the last part which is the ID
    const currentId = urlParts[urlParts.length - 1];

    // Replace the current ID with the new one
    const newUrl = currentUrl.replace(currentId, newId);

    // Navigate to the new URL
    this.router.navigateByUrl(newUrl);
  }
}
