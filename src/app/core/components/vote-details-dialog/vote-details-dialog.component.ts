import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {LoadingComponent} from "../loading.component";
import {VoteDetailsService} from "../../services/vote-details.service";
import {map, Observable, switchMap} from "rxjs";
import {VoteDetails} from "../../interfaces/vote-details";
import {TaskDetails} from "../../interfaces/task-details";
import {PriorityComponent} from "../priority.component";
import {VoteActionsComponent} from "../../../secure/user/votes/vote-actions/vote-actions.component";
import {VoteStatusComponent} from "../vote-status.component";
import {ArabicDatePipe} from "../../pipes/arabic-date.pipe";
import {MagicScrollDirective} from "../../directives/magic-scroll.directive";
import {UserImageComponent} from "../user-image.component";

@Component({
  selector: 'vote-details-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, TranslateModule, LoadingComponent, PriorityComponent, VoteActionsComponent, VoteStatusComponent, ArabicDatePipe, MagicScrollDirective, UserImageComponent],
  templateUrl: './vote-details-dialog.component.html',
  styleUrls: ['./vote-details-dialog.component.scss']
})
export class VoteDetailsDialogComponent {
  dir: any = document.dir;
  service = inject(VoteDetailsService);
  details$: Observable<VoteDetails> = this.service.hasChanged.pipe(switchMap(() => this.service.getDetails().pipe(map((res: any) => res))));

}
