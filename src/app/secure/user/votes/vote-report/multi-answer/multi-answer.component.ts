import {Component, inject, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QuestionChoices} from "../../../../../core/interfaces/vote-report";
import {ColorsList} from "../../../../../core/functions/color-list";
import {TranslateModule} from "@ngx-translate/core";
import {ArabicNumbersPipe} from "../../../../../core/pipes/arabic-numbers.pipe";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute} from "@angular/router";
import {ResponsesComponent} from "../../../../../core/components/responses.component";

@Component({
  selector: 'multi-answer',
  standalone: true,
  imports: [CommonModule, TranslateModule, ArabicNumbersPipe],
  templateUrl: './multi-answer.component.html',
  styleUrls: ['./multi-answer.component.scss']
})
export class MultiAnswerComponent {
  @Input() answers!: QuestionChoices[];
  @Input() anonymous = true;
  dialog = inject(MatDialog);
  route = inject(ActivatedRoute);
  colors: string[] = ColorsList();

  getResponses(id: number) {
    this.dialog.open(ResponsesComponent, {
      panelClass: 'vote-assignees-dialog',
      data: {
        id,
        voteFormId: +this.route.snapshot.params['id']
      }
    })
  }

}
