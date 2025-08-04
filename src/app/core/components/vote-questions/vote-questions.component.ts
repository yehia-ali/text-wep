import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputLabelComponent} from "../../inputs/input-label.component";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ArabicNumbersPipe} from "../../pipes/arabic-numbers.pipe";
import {Subscription} from "rxjs";
import {NgSelectModule} from "@ng-select/ng-select";

@Component({
  selector: 'vote-questions',
  standalone: true,
  imports: [CommonModule, InputLabelComponent, ReactiveFormsModule, TranslateModule, ArabicNumbersPipe, NgSelectModule],
  templateUrl: './vote-questions.component.html',
  styleUrls: ['./vote-questions.component.scss']
})
export class VoteQuestionsComponent implements OnInit, OnDestroy {
  @Output() questionsForm = new EventEmitter();
  @Output() heightChanged = new EventEmitter();
  form: FormGroup;

  subscription!: Subscription;

  questionType = [
    {
      name: 'checkbox',
      icon: 'bx-radio-circle-marked',
      size: '25',
      value: 1
    }, {
      name: 'multiselect',
      icon: 'bxs-check-square',
      size: '28',
      value: 2
    }
  ]

  constructor(public translate: TranslateService, private fb: FormBuilder) {
    this.form = this.fb.group({
      voteFormQuestions: this.fb.array([])
    });
  }


  questions() {
    return this.form.controls['voteFormQuestions'] as FormArray;
  }

  answers(questionIndex: number) {
    return this.questions().at(questionIndex).get('voteFormQuestionChoices') as FormArray;
  }

  addQuestion() {
    this.questions().push(this.fb.group({
      title: ['', Validators.required],
      type: [1, Validators.required],
      voteFormQuestionChoices: this.fb.array([])
    }));
    this.addAnswer(this.questions().controls.length - 1);
    this.addAnswer(this.questions().controls.length - 1);
    this.heightChanged.emit()
  }

  removeQuestion(questionIndex: number) {
    // if there is more than 1 question
    if (this.questions().controls.length > 1) {
      this.questions().removeAt(questionIndex);
    }
  }

  addAnswer(questionIndex: number) {
    this.answers(questionIndex).push(this.fb.group({
      text: ['', Validators.required],
    }));
  }

  removeAnswer(questionIndex: any, answerIndex: any) {
    // if there is more than 2 answers
    if (this.answers(questionIndex).length > 2) {
      this.answers(questionIndex).removeAt(answerIndex);
    }
  }

  ngOnInit(): void {
    this.addQuestion();
    this.questionsForm.emit(this.form);
    this.subscription = this.form.valueChanges.subscribe(() => {
      this.questionsForm.emit(this.form);
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
