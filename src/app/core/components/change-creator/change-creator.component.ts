import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BidiModule} from "@angular/cdk/bidi";
import {InputLabelComponent} from "../../inputs/input-label.component";
import {MatButtonModule} from "@angular/material/button";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {SelectUserComponent} from "../select-user.component";
import {TranslateModule} from "@ngx-translate/core";
import {AllTasksService} from "../../services/all-tasks.service";
import {AlertService} from "../../services/alert.service";
import {ChatService} from "../../../secure/user/chat/chat.service";

@Component({
  selector: 'change-creator',
  standalone: true,
  imports: [CommonModule, BidiModule, InputLabelComponent, MatButtonModule, MatDialogModule, SelectUserComponent, TranslateModule],
  templateUrl: './change-creator.component.html',
  styleUrls: ['./change-creator.component.scss']
})
export class ChangeCreatorComponent {
  loading = false;
  selectedValue: any = []
  service = inject(AllTasksService);
  alert = inject(AlertService);
  dialog = inject(MatDialog);
  chatSer = inject(ChatService);

  changeCreator() {
    this.loading = true;
    this.service.changeCreator(this.selectedValue[0].id).subscribe((res: any) => {
      if (res.success) {
        this.alert.showAlert('change_creator_success');
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
