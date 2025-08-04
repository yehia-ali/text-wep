import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {UserImageComponent} from "./user-image.component";
import {TaskVoteUsersComponent} from "./task-vote-users.component";
import {InfoSidebarComponent} from "./info-sidebar.component";

@Component({
  selector: 'task-users',
  standalone: true,
  imports: [CommonModule, TranslateModule, UserImageComponent, TaskVoteUsersComponent, InfoSidebarComponent],
  template: `
    <div class="flex aic jcsb">
      <div class="creator">
        <p class="fs-17 bold">{{ 'created_by' | translate }}</p>
        <div class="flex aic mt-1">
          <user-image [img]="creatorImage" [id]="creatorId"></user-image>
          <p class="ml-1">{{ creatorName }}</p>
        </div>
      </div>

      <div class="cc-assignees flex-column-center" *ngIf="images?.length > 0" (click)="getUsers()">
        <p class="fs-17 bold mb-1">{{ type | translate }}</p>
        <task-vote-users [images]="images"></task-vote-users>
      </div>

      <div class="assignee">
        <p class="fs-17 bold">{{ 'assignee' | translate }}</p>
        <div class="flex aic mt-1">
          <user-image [img]="assigneeImage" [id]="assigneeId"></user-image>
          <p class="ml-1">{{ assigneeName }}</p>
        </div>
      </div>
    </div>


    <info-sidebar [open]="open">
      <ng-container header>
        <h2 class="black">{{ type  | translate }}</h2>
      </ng-container>

      <ng-container content>
        <div class="p-2">
          <div class="reporter bg-gray rounded mb-1 p-1 flex aic" *ngFor="let reporter of users">
            <div class="start">
              <user-image [img]="reporter.image" [id]="reporter.reporterId" [dim]="35"></user-image>
            </div>
            <div class="end ml-1">
              <p class="line-height">{{ reporter.name }}</p>
              <p class="muted fs-14">{{ reporter.jobTitle }}</p>
            </div>
          </div>
        </div>
      </ng-container>
    </info-sidebar>

  `,
  styles: [
  ]
})
export class TaskUsersComponent {
  @Input() task: any;
  @Input() type: any;
  @Input() creatorName: any;
  @Input() creatorImage: any;
  @Input() creatorId!: number;
  @Input() assigneeName: any;
  @Input() assigneeImage: any;
  @Input() assigneeId!: number;
  @Input() images: any;
  @Input() users: any;

  constructor() { }

  ngOnInit(): void {
  }

  open = false;
  getUsers() {
    this.open = false;
    setTimeout(() => {
      this.open = true;
    }, 0);
  }
}
