import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {InputLabelComponent} from "../inputs/input-label.component";
import {SelectUserComponent} from "./select-user.component";
import {AllTasksService} from "../services/all-tasks.service";
import {AlertService} from "../services/alert.service";
import {ChatService} from "../../secure/user/chat/chat.service";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'handover',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatDialogModule, InputLabelComponent, SelectUserComponent, MatButtonModule],
  template: `
      <div class="handover" dir="auto">
          <h2>{{'handover' | translate}}</h2>
          <div mat-dialog-content>
              <input-label key="assignees"/>
              <select-user [multi]="false" (getSelectedUsers)="selectedValue = $event" text="assignee" classes="w-100"/>
          </div>
          <div mat-dialog-actions align="end">
              <button mat-raised-button color="primary" class="px-4" [disabled]="!selectedValue.length" (click)="handover()">{{'save' | translate}}</button>
              <button mat-raised-button mat-dialog-close class="px-3">{{'cancel' | translate}}</button>
          </div>
      </div>
  `,
  styles: []
})
export class HandoverComponent {
  loading = false;
  selectedValue: any = []
  service = inject(AllTasksService);
  alert = inject(AlertService);
  dialog = inject(MatDialog);
  chatSer = inject(ChatService);

  handover() {
    this.loading = true;
    this.service.handover(this.selectedValue[0].id).subscribe((res: any) => {
      if (res.success) {
        this.alert.showAlert('handover_success');
        this.dialog.closeAll();
        this.service.hasChanged.next(true);
        this.service.selectedTasksToHandoverValue.map((task: any) => {
          this.chatSer.refreshTaskUser(task.taskGroupId).subscribe()
        });
        this.service.selectedTasksToHandover.next([])
      }
      this.loading = false;
    })
  }

}
