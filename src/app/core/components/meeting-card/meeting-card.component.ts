import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {MeetingDialogComponent} from "../meeting-dialog/meeting-dialog.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'meeting-card',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './meeting-card.component.html',
  styleUrls: ['./meeting-card.component.scss']
})
export class MeetingCardComponent {

  dialog = inject(MatDialog);

  joinMeeting() {
    this.dialog.open(MeetingDialogComponent, {
      panelClass: 'small-dialog'
    });
  }
}
