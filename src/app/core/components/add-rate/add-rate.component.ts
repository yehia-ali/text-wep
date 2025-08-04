import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {RateFormComponent} from "../rate-form/rate-form.component";
import {TaskDetails} from "../../interfaces/task-details";

@Component({
  selector: 'add-rate',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <!--  add rate  -->
    <div class="add-rate flex aic pointer" (click)="addRate()" *ngIf="!resultMode">
      <div class="img flex-center">
        <img src="../../../../assets/images/icons/add-rate.svg" alt="add rate">
      </div>
      <p class="primary ml-50 bold">{{text | translate}}</p>
    </div>
    <div class=" flex aic jcc pointer rounded bg-primary shadow px-2 py-50" (click)="addRate()" *ngIf="resultMode">
      <p class="white">{{text | translate}}</p>
    </div>
  `,
  styles: []
})
export class AddRateComponent {
  @Input() details!: TaskDetails | any;
  @Input() text = '';
  @Input() resultMode = false;
  @Output() rateAdded = new EventEmitter();

  constructor(private dialog: MatDialog) {
  }

  addRate() {
    let dialogRef  = this.dialog.open(RateFormComponent, {
      width: '400px',
      data: {
        id: this.details.taskId,
        taskType: this.details.taskGroupType,
        target: this.details.kpiTarget || 0,
        isSession: false,
      }
    })

    dialogRef.afterClosed().subscribe(() => {
      this.rateAdded.emit(true)
    })
  }
}
