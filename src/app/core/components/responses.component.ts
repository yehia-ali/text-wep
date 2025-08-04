import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AssigneesResponse} from "../interfaces/assignees-response";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {VoteReportService} from "../services/vote-report.service";
import {TranslateModule} from "@ngx-translate/core";
import {UserImageComponent} from "./user-image.component";
import {NotFoundComponent} from "./not-found.component";
import {LoadingComponent} from "./loading.component";

@Component({
  selector: 'responses',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatDialogModule, UserImageComponent, NotFoundComponent, LoadingComponent],
  template: `
      <div class="vote-assignees" dir="auto">
          <div class="flex aic jcsb border-bottom pb-2">
              <h3>{{'responses' | translate}}</h3>
              <i class='bx bx-x danger fs-30 pointer' mat-dialog-close=""></i>
          </div>

          <div mat-dialog-content class="my-1 relative">
              <ng-container *ngIf="response.length > 0 || !loading">
                  <div class="border-bottom pb-1" *ngFor="let assignee of response">
                      <div class="flex aic jcsb">
                          <div class="start flex aic gap-x-1">
                              <user-image [img]="assignee.assigneeImageUrl"></user-image>
                              <div class="info">
                                  <div class="info-text">{{ assignee.assigneeName }}</div>
                                  <div class="info-text muted fs-14">{{ assignee.assigneeJob }}</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </ng-container>
              <not-found class="a-center" *ngIf="response && response.length == 0 && !loading"></not-found>
              <loading class="a-center" *ngIf="loading"></loading>
          </div>
      </div>
  `,
  styles: []
})
export class ResponsesComponent {
  response: AssigneesResponse[] = [];
  loading = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private service: VoteReportService) {
  }

  ngOnInit(): void {
    this.service.getResponses(this.data.id, this.data.voteFormId).subscribe((res: any) => {
      this.response = res.data.items;
      this.loading = false;
    })
  }

}
