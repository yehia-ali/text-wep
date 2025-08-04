import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {MeetingDialogComponent} from "../meeting-dialog/meeting-dialog.component";
import {CreateTaskComponent} from "../create-task/create-task.component";

@Component({
  selector: 'schedule-meeting-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './schedule-meeting-card.component.html',
  styleUrls: ['./schedule-meeting-card.component.scss']
})
export class ScheduleMeetingCardComponent {
  dialog = inject(MatDialog);

  joinMeeting() {
    this.dialog.open(MeetingDialogComponent, {
      panelClass: 'small-dialog'
    });
  }

  scheduleMeeting() {
    this.dialog.open(CreateTaskComponent, {
      disableClose: true,
      panelClass: 'create-task-dialog',
      data: {
        isMeeting: true
      }
    })
  }
}
