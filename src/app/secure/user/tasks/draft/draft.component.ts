import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from "../../../../core/components/layout.component";
import {MagicScrollDirective} from "../../../../core/directives/magic-scroll.directive";
import {PriorityComponent} from "../../../../core/components/priority.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationMessageComponent} from "../../../../core/dialogs/confirmation-message.component";
import {CreateTaskComponent} from "../../../../core/components/create-task/create-task.component";
import {DraftService} from "../../../../core/services/draft.service";
import {NgxPaginationModule} from "ngx-pagination";
import {TranslateModule} from "@ngx-translate/core";
import {AlertService} from "../../../../core/services/alert.service";

@Component({
  selector: 'draft',
  standalone: true,
  imports: [CommonModule, LayoutComponent, MagicScrollDirective, PriorityComponent, MatTooltipModule, NotFoundComponent, LoadingComponent, NgxPaginationModule, TranslateModule],
  templateUrl: './draft.component.html',
  styleUrls: ['./draft.component.scss']
})
export class DraftComponent implements OnInit {
  drafts: any = [];
  loading = true;
  meta: any;

  constructor(private service: DraftService, private dialog: MatDialog, private alert: AlertService) {
  }

  ngOnInit(): void {
    this.service.drafts.subscribe(res => {
      this.drafts = res
    });
    this.service.meta.subscribe(res => this.meta = res);
    this.service.loading.subscribe(res => this.loading = res);
    // if (this.drafts.length == 0) {
    this.getDrafts();
    // }
  }

  getDrafts() {
    this.service.getDrafts().subscribe()
  }

  changePage(event: any) {
  }

  deleteDraft(draft: any) {
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'small-dialog',
      data: {
        btn_name: "confirm",
        message: "delete_draft_message",
        classes: 'bg-danger white',
        id: draft.draftId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteDraft(draft.draftId).subscribe(res => {
          this.alert.showAlert('draft_deleted');
          this.getDrafts();
        })
      }
    })
  }

  createTask(task: any) {
    let dialogRef = this.dialog.open(CreateTaskComponent, {
      panelClass: 'create-task-dialog',
      disableClose: true,
      data: {
        task,
        isDraft: true
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getDrafts();
      }
    })
  }

  trackBy(index: any, item: any) {
    return item.id;
  }
}
