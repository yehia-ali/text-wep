import {Component, inject, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from "@angular/router";
import {MatMenuModule} from "@angular/material/menu";
import {TranslateModule} from "@ngx-translate/core";
import {VoteAssigneesComponent} from "../../../../core/dialogs/vote-assignees/vote-assignees.component";
import {ConfirmationMessageComponent} from "../../../../core/dialogs/confirmation-message.component";
import {MatDialog} from "@angular/material/dialog";
import {VoteActionsService} from "../../../../core/services/vote-actions.service";
import {AlertService} from "../../../../core/services/alert.service";

@Component({
  selector: 'vote-actions',
  standalone: true,
  imports: [CommonModule, RouterLink, MatMenuModule, TranslateModule],
  templateUrl: './vote-actions.component.html',
  styleUrls: ['./vote-actions.component.scss']
})
export class VoteActionsComponent {
  @Input() id: any;
  @Input() voteFormStateId: any;
  @Input() isCreator = true;
  @Input() isReportPublic = true;
  @Input() hasEnded = true;
  @Input() hasStarted = true;
  @Input() callbackService: any;
  service = inject(VoteActionsService);
  dialog = inject(MatDialog);
  alert = inject(AlertService);

  getAssignees(id: number) {
    this.dialog.open(VoteAssigneesComponent, {
      panelClass: 'vote-assignees-dialog',
      data: {
        id: id
      }
    })
  }

  archiveVote() {
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      data: {
        message: 'archive_vote',
        btn_name: 'continue',
        classes: 'bg-primary white',
        id: this.id
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.service.archiveVote(this.id).subscribe((res: any) => {
          if (res.success) {
            this.alert.showAlert('vote_archived');
            this.callbackService.hasChanged.next(true);
          }
        });
      }
    });
  }

  deleteVote() {
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      data: {
        message: 'delete_vote',
        btn_name: 'confirm',
        classes: 'bg-danger white',
        id: this.id
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.service.deleteVote(this.id).subscribe((res: any) => {
          if (res.success) {
            this.alert.showAlert('vote_deleted');
            this.callbackService.hasChanged.next(true);
          }
        });
      }
    });
  }
}
