import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogModule} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";
import {SubmitButtonComponent} from "./submit-button.component";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'task-rejection-reason',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule, MatButtonModule, SubmitButtonComponent, FormsModule],
  template: `
      <div class="rejection-reason" dir="auto">
          <h3>{{'reject_task' | translate}}</h3>
          <div class="reason" mat-dialog-content>
              <label>{{'reason_of_rejection' | translate}}</label>
              <textarea class="input" rows="4" [(ngModel)]="reason"></textarea>
          </div>
          <div mat-dialog-actions>
              <div class="flex w-100">
                  <button mat-raised-button mat-dialog-close="" class="flex-auto dark-color clickable-btn rounded cancel-btn">{{'cancel' | translate}}</button>
                  <button mat-raised-button [mat-dialog-close]="reason" class="flex-auto rounded" [ngClass]="{'bg-danger': reason}" [disabled]="!reason">{{'reject' | translate}}</button>
              </div>
          </div>
      </div>
  `,
  styles: []
})
export class TaskRejectionReasonComponent {
  reason = '';
}
