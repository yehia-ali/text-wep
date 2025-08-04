import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VoteDetailsService} from "../../../../core/services/vote-details.service";
import {concatMap, map, Observable} from "rxjs";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {VoteDetails} from "../../../../core/interfaces/vote-details";
import {LayoutComponent} from "../../../../core/components/layout.component";
import {PriorityComponent} from "../../../../core/components/priority.component";
import {VoteStatusComponent} from "../../../../core/components/vote-status.component";
import {MatMenuModule} from "@angular/material/menu";
import {TranslateModule} from "@ngx-translate/core";
import {VoteActionsComponent} from "../vote-actions/vote-actions.component";
import {MagicScrollDirective} from "../../../../core/directives/magic-scroll.directive";
import {UserImageComponent} from "../../../../core/components/user-image.component";
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {ArabicNumbersPipe} from "../../../../core/pipes/arabic-numbers.pipe";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioModule} from "@angular/material/radio";
import {MatButtonModule} from "@angular/material/button";
import {AlertService} from "../../../../core/services/alert.service";
import {LoadingComponent} from "../../../../core/components/loading.component";

@Component({
  selector: 'vote-details',
  standalone: true,
  imports: [CommonModule, LayoutComponent, PriorityComponent, VoteStatusComponent, MatMenuModule, TranslateModule, RouterModule, VoteActionsComponent, MagicScrollDirective, UserImageComponent, ArabicDatePipe, ArabicNumbersPipe, MatCheckboxModule, MatRadioModule, MatButtonModule, LoadingComponent],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  id!: number;
  editable = false;
  loading = false;
  invalid = true;
  allQuestions: { name: string, id: number, answers: number[] }[] = [];
  voteDetails!: any;
  details$!: Observable<VoteDetails>;

  constructor(public service: VoteDetailsService, private alert: AlertService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.details$ = this.route.params.pipe(concatMap(
        (params: any) => {
          this.service.id.next(params.id);
          this.id = params.id;
          return this.service.details$;
        }),
      map((details: any) => {
        this.voteDetails = details;
        details.voteFormQuestions?.forEach((question: any) => {
          this.allQuestions.push({name: question.title, id: question.id, answers: []});
        });
        return details;
      })
    );
  }


  submit() {
    if (!this.invalid) {
      const ids: any[] = [];
      this.loading = true;

      this.allQuestions.forEach((question: any) => {
        question.answers.forEach((answer: any) => {
          ids.push({voteFormQuestionChoiceId: answer});
        });
      });

      const data = {
        voteFormQuestionChoiceAssignees: ids
      };

      this.service.submitAnswers(data).subscribe((res: any) => {
        if (res.success) {
          this.editable = false;
          this.service.hasChanged.next(true);
          this.alert.showAlert('voted_successfully');
        }
        this.loading = false;
      });
    }
  }

  edit() {
    this.editable = !this.editable;
    this.invalid = false;
    if (this.editable) {
      this.allQuestions = [];
      this.voteDetails.voteFormQuestions.forEach((question: any) => {
        const answers = question.voteFormQuestionChoices
          .filter((res: any) => res.isSelected)
          .map((res: any) => res.id);
        this.allQuestions.push({name: question.title, id: question.id, answers});
      });
    }
  }

  addMultiAnswers(questionIndex: number, answer: any, event: any) {
    if (event.checked) {
      this.allQuestions[questionIndex].answers.push(answer.id);
    } else {
      const index = this.allQuestions[questionIndex].answers.indexOf(answer.id);
      this.allQuestions[questionIndex].answers.splice(index, 1);
    }
    this.checkAnswers();
  }

  addSingleAnswer(questionIndex: number, event: any) {
    this.allQuestions[questionIndex].answers = [event.value];
    this.checkAnswers();
  }

  checkAnswers() {
    let empty = false;
    this.allQuestions.forEach((question: any) => {
      if (question.answers.length === 0) {
        empty = true;
      }
    });
    this.invalid = empty;
  }

}
