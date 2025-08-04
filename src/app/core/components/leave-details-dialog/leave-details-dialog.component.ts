import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {LoadingComponent} from "../loading.component";
import {LeavesDetailsService} from "../../services/leaves-details.service";
import {map, Observable, switchMap} from "rxjs";
import {LeavesDetails} from "../../interfaces/leaves-details";
import {MatMenuModule} from "@angular/material/menu";
import {TaskAttachmentsComponent} from "../task-attachments.component";
import {UserImageComponent} from "../user-image.component";
import {HistoryComponent} from "../history.component";
import {InfoSidebarComponent} from "../info-sidebar.component";

@Component({
  selector: 'leave-details-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, TranslateModule, LoadingComponent, MatMenuModule, TaskAttachmentsComponent, UserImageComponent, HistoryComponent, InfoSidebarComponent],
  templateUrl: './leave-details-dialog.component.html',
  styleUrls: ['./leave-details-dialog.component.scss']
})
export class LeaveDetailsDialogComponent {
  dir: any = document.dir;
  service = inject(LeavesDetailsService);
  details: any;
  details$: Observable<LeavesDetails> = this.service.hasChanged.pipe(switchMap(() => this.service.getRequestDetails().pipe(map((res: any) => {
    this.details = res;
    return res
  }))));
  historyIsOpen = false;

  getHistory() {
    this.historyIsOpen = false;
    setTimeout(() => {
      this.historyIsOpen = true;
    }, 0);
  }
}
