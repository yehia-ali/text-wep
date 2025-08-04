import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {VoteAssignee} from "../../interfaces/vote-assignee";
import {TranslateModule} from "@ngx-translate/core";
import {UserImageComponent} from "../../components/user-image.component";
import {VoteStatusComponent} from "../../components/vote-status.component";
import {NotFoundComponent} from "../../components/not-found.component";
import {LoadingComponent} from "../../components/loading.component";
import {VoteActionsService} from "../../services/vote-actions.service";

@Component({
  selector: 'vote-assignees',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule, UserImageComponent, VoteStatusComponent, NotFoundComponent, LoadingComponent],
  templateUrl: './vote-assignees.component.html',
  styleUrls: ['./vote-assignees.component.scss']
})
export class VoteAssigneesComponent {
  voteState!: any;
  assignees: VoteAssignee[] = []

  loading = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private service: VoteActionsService) {
  }

  ngOnInit(): void {
    this.getAssignees()
  }


  filter(stateId: number) {
    this.assignees = []
    this.loading = true;
    if (this.voteState == stateId) {
      this.voteState = null
    } else {
      this.voteState = stateId;
    }
    this.getAssignees(this.voteState);
  }

  getAssignees(stateId = null) {
    this.service.getVoteAssignees(this.data.id, stateId).subscribe(res => {
      this.assignees = res;
      this.loading = false;
    })
  }
}
