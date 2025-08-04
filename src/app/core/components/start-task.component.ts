import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";
import {TaskDetails} from "../interfaces/task-details";
import {TaskDetailsService} from "../services/task-details.service";
import {AlertService} from "../services/alert.service";
import {Router} from "@angular/router";
import {MeetingService} from "../services/meeting.service";

@Component({
  selector: 'start-task',
  standalone: true,
  imports: [CommonModule, MatButtonModule, TranslateModule],
  template: `
      <div class="start-task mb-2">
          <button mat-raised-button color="primary" class="w-100 white rounded start_task" [disabled]="loading" (click)="clicked()"
                  *ngIf="details.taskStateId == 1 && details.hasStarted && details.taskGroupType != 4">
              <div class="flex-center aic" *ngIf="!loading">
                  <img src="assets/images/icons/play.svg" alt="" *ngIf="details.taskGroupType != 8">
                  <div class="ml-1 p-0 fs-18">
                      <span *ngIf="details.taskGroupType != 8">{{ 'start_task' | translate }}</span>
                      <span *ngIf="details.taskGroupType == 8" class="flex aic">
                {{ 'noted' | translate }}
                          <i class='bx bx-check fs-25 ml-25'></i>
            </span>
                  </div>
              </div>
              <div class="flex-center" *ngIf="loading">
                  <i class='bx bx-loader-circle bx-spin bx-rotate-90 mr-50 fs-20'></i>
                  <span class="fs-16">{{ 'loading' | translate }}</span>
              </div>
          </button>

          <button mat-raised-button color="primary" class="w-100 white rounded start_task" [disabled]="loading" (click)="joinMeeting()" *ngIf="details.taskGroupType == 4">
              <div class="flex-center" *ngIf="!loading">
                  <img src="assets/images/icons/play.svg" alt="play icon">
                  <h3 class="ml-1">{{ 'join_meeting' | translate }}</h3>
              </div>
              <div class="flex-center" *ngIf="loading">
                  <i class='bx bx-loader-circle bx-spin bx-rotate-90 mr-50 fs-20'></i>
                  <span class="fs-16">{{ 'loading' | translate }}</span>
              </div>
          </button>
      </div>

  `,
  styles: []
})
export class StartTaskComponent {
  @Input() details!: TaskDetails;
  loading = false;

  constructor(private service: TaskDetailsService, private alert: AlertService, private router: Router, private meetingSer: MeetingService) {
  }

  joinMeeting() {
    this.loading = true;
    let taskStarted = this.details.taskStateId == 1 && this.details.hasStarted;
    let taskedinMeet = this.details.link.includes('meeting.taskedin.net');
    let meetingLink = taskedinMeet ? this.details.link.split('.net/').pop() : this.details.link;
    let getMeeting = () => {
      this.loading = false;
      if (taskedinMeet) {
        this.meetingSer.meetingName$.next(meetingLink);
        this.router.navigate(['/meeting/meet'])
      } else {
        window.open(meetingLink, '_blank');
        this.service.hasChanged.next(true);
      }
    }
    if (taskStarted) {
      const data = {
        id: this.details.taskId,
        percentage: 0,
        actualTime: null
      }
      this.service.updateEstimate({estimatedTime: this.details.expectedTime, id: this.details.taskId}).subscribe(() => {
        this.service.updateTaskProgress(data).subscribe((res: any) => {
          if (res.success) {
            getMeeting()
          } else {
            this.loading = false;
          }
        });
      });
    } else {
      getMeeting()
    }
  }

  clicked() {
    this.loading = true;
    if (this.details.taskGroupType != 8) {
      const data = {
        id: this.details.taskId,
        percentage: 0,
        actualTime: null
      }
      this.service.updateEstimate({estimatedTime: this.details.expectedTime, id: this.details.taskId}).subscribe(() => {
        this.service.updateTaskProgress(data).subscribe((res: any) => {
          this.ifSuccess(res)
        });
      });

    } else if (this.details.taskGroupType == 8) {
      this.service.noted(this.details.taskId).subscribe((res: any) => {
        this.ifSuccess(res)
      })
    }
  }

  ifSuccess(res: any) {
    if (res.success) {
      this.alert.showAlert('task_updated');
      this.service.hasChanged.next(true);
    }
    this.loading = false;
  }

}
