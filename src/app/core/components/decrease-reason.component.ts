import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {InputLabelComponent} from "../inputs/input-label.component";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'decrease-reason',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule, InputLabelComponent, FormsModule, MatButtonModule],
  template: `
      <div class="decrease-form" dir="auto">
          <h2 class="black mb-1">{{ 'decrease_reason' | translate}}</h2>

          <div mat-dialog-content class="mb-1">
              <input-label [key]="'the_reason'"></input-label>
              <textarea name="" id="" cols="30" rows="3" class="input" [(ngModel)]="reason"></textarea>
          </div>

          <div mat-dialog-actions>
              <div class="flex-center w-100 gap-x-1">
                  <button mat-dialog-close="" class="flex-auto py-1 dark-color clickable-btn rounded cancel-btn">{{'cancel' | translate}}</button>
                  <button [mat-dialog-close]="reason" class="clickable-btn white flex-auto py-1 rounded bg-primary border-primary" [disabled]="!reason">{{'save' | translate}}</button>
              </div>
          </div>
      </div>

  `,
  styles: [
  ]
})
export class DecreaseReasonComponent {
  reason = '';
}
