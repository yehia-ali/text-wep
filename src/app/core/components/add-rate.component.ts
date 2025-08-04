import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {SessionDetails} from "../interfaces/session-details";
import {MatDialog} from "@angular/material/dialog";
import {RateFormComponent} from "./rate-form/rate-form.component";

@Component({
  selector: 'add-rate',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <!--  add rate  -->
    <div class="add-rate flex aic pointer" (click)="addRate()">
      <div class="img flex-center">
        <img src="../../../assets/images/icons/add-rate.svg" alt="add rate">
      </div>
      <p class="primary ml-50 bold">{{text | translate}}</p>
    </div>
  `,
  styles: []
})
export class AddRateComponent {
  @Input() session!: SessionDetails;
  @Input() text!: string;

  constructor(private dialog: MatDialog) {
  }

  addRate() {
    this.dialog.open(RateFormComponent, {
      width: '500px',
      data: {
        isSession: true,
        session: this.session,
      }
    })
  }
}
