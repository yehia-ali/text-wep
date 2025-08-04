import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MagicScrollDirective} from "../../directives/magic-scroll.directive";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputLabelComponent} from "../../inputs/input-label.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {SelectUserComponent} from "../select-user.component";
import {PriorityComponent} from "../priority.component";
import {MatButtonModule} from "@angular/material/button";
import {AlertService} from "../../services/alert.service";
import {CreateVoteService} from "../../services/create-vote.service";
import {SubmitButtonComponent} from "../submit-button.component";
import {InputErrorComponent} from "../../inputs/input-error.component";
import {OwlDateTimeModule} from "@danielmoncada/angular-datetime-picker";
import {VoteQuestionsComponent} from "../vote-questions/vote-questions.component";
import {FormatDate} from "../../functions/formatDate";

@Component({
  selector: 'create-vote',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule, MagicScrollDirective, ReactiveFormsModule, InputLabelComponent, NgSelectModule, SelectUserComponent, PriorityComponent, MatButtonModule, SubmitButtonComponent, InputErrorComponent, OwlDateTimeModule, VoteQuestionsComponent],
  templateUrl: './create-vote.component.html',
  styleUrls: ['./create-vote.component.scss']
})
export class CreateVoteComponent implements OnInit {
  @ViewChild('endPicker') pickerEnd: any;
  lang = localStorage.getItem('language') || 'en';
  form: FormGroup;
  questionsForm!: FormGroup;
  loading = false;
  selectedUsers: any = [];
  now: any = new Date(new Date().setMinutes(new Date().getMinutes() + 10));
  usersLength = 2;

  priorities = [
    {value: 2, name: 'high'},
    {value: 1, name: 'medium'},
    {value: 0, name: 'low'},
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private service: CreateVoteService, private fb: FormBuilder, private dialog: MatDialog, public translate: TranslateService, private alertSer: AlertService, private elm: ElementRef) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      priority: [1, Validators.required],
      isAnonymous: [false, Validators.required],
      isReportPublic: [false, Validators.required],
      voteFormAssignees: ['', Validators.required]
    })
  }

  ngOnInit(): void {

  }

  submit() {
    this.loading = true;
    const data = {
      ...this.form.value,
      startDate: FormatDate(this.form.value.startDate, true),
      endDate: FormatDate(this.form.value.endDate, true),
      voteFormAssignees: this.form.value.voteFormAssignees.map((assigneeId: any) => {
        return {assigneeId};
      }),
      ...this.questionsForm.value,
    };
    this.service.createVote(data).subscribe((res: any) => {
      if (res.success) {
        this.alertSer.showAlert('create_vote_success');
        this.dialog.closeAll();
      }
      this.loading = false;
    })
  }

  selectUsers(users: any) {
    this.selectedUsers = users;
    if (this.selectedUsers.length > 0) {
      this.form.patchValue({
        voteFormAssignees: this.selectedUsers.map((user: any) => user.id)
      })
    } else {
      this.form.patchValue({
        voteFormAssignees: []
      })
    }
    this.usersLength = users.length;
  }

  get f() {
    return this.form.controls;
  }

  scrollBottom() {
    // to scroll to the bottom of the list when adding a new todo
    setTimeout(() => {
      this.elm.nativeElement.querySelector('.mat-mdc-dialog-content').scrollTop = this.elm.nativeElement.querySelector('.mat-mdc-dialog-content').scrollHeight;
    }, 0);
  }

}
