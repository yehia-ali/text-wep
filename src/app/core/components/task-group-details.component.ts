import {Component, EventEmitter, inject, Input, OnChanges, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl} from "@angular/forms";
import {InfoSidebarComponent} from "./info-sidebar.component";
import {MatTabsModule} from "@angular/material/tabs";
import {LoadingComponent} from "./loading.component";
import {NotFoundComponent} from "./not-found.component";
import {TaskGroupAssigneesComponent} from "./task-group-assignees.component";
import {TaskGroupReportersComponent} from "./task-group-reporters.component";
import {TranslateModule} from "@ngx-translate/core";
import {TaskGroupReporter} from "../interfaces/task-group-reporter";
import {TaskGroupAssignee} from "../interfaces/task-group-assignee";
import {TaskDetailsService} from "../services/task-details.service";
import {ChatService} from "../../secure/user/chat/chat.service";
import {Router} from "@angular/router";

@Component({
  selector: 'task-group-details',
  standalone: true,
  imports: [CommonModule, InfoSidebarComponent, MatTabsModule, LoadingComponent, NotFoundComponent, TaskGroupAssigneesComponent, TaskGroupReportersComponent, TranslateModule],
  template: `
    <info-sidebar [open]="open">
      <ng-container header>
        <div class="flex aic jcsb w-100">
          <h3 class="card-title">{{task?.title || task}}</h3>
          <button class="img clickable-btn chat ml-2" (click)="chat()" *ngIf="!isChat">
            <img src="assets/images/icons/messages.svg" alt="" class="convert-image-color" width="24">
          </button>
        </div>
      </ng-container>

      <ng-container content>
        <mat-tab-group class="h-100" [selectedIndex]="selected.value" (selectedIndexChange)="selected.setValue($event)" animationDuration="400ms">
          <mat-tab class="h-100" [label]="'assignees' | translate">
            <div class="overflow-hidden h-100">
              <task-group-assignees *ngIf="!assigneesLoading" [isDetails]="isDetails" [isProject]="isProject" [tasks]="assignees" [taskGroupId]="task?.id"></task-group-assignees>
              <loading *ngIf="assigneesLoading"/>
            </div>
          </mat-tab>
          <mat-tab [label]="'reporters' | translate">
            <div class="reporters px-2 py-2" [ngClass]="{'h-100': reporters && reporters.length == 0}">
              <ng-container *ngIf="reporters && reporters.length > 0">
                <task-group-reporters [reporters]="reporters"></task-group-reporters>
              </ng-container>
              <ng-container *ngIf="reporters && reporters.length == 0">
                <not-found></not-found>
              </ng-container>
            </div>
          </mat-tab>
        </mat-tab-group>
      </ng-container>
    </info-sidebar>

  `,
  styles: [`
     .overflow-hidden{
        overflow:hidden;
      }
    `]
})
export class TaskGroupDetailsComponent implements OnChanges {
  @Input() open = false;
  @Input() task: any;
  @Input() isDetails = false;
  @Input() isProject = false;
  @Input() reporters: TaskGroupReporter[] = [];
  @Input() assignees: TaskGroupAssignee[] = [];
  @Input() isChat = false;
  @Input() assigneesLoading = false;
  @Output() close = new EventEmitter();
  selected = new FormControl(0)
  taskDetailsSer = inject(TaskDetailsService);
  chatSer = inject(ChatService);
  router = inject(Router);

  ngOnChanges(changes: any): void {
    if (changes.task) {
      this.selected.setValue(0)
    }
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  chat() {
    this.taskDetailsSer.getOrCreateChat(this.task.id).subscribe((res: any) => {
      this.chatSer.roomId.next(res.data.taskGroupChatId);
      this.chatSer.getRoomChat(true);
      this.router.navigate(['/chat'])
    })
  }
}
