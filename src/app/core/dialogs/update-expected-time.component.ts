import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectTimeComponent} from "../components/select-time.component";
import {TranslateModule} from "@ngx-translate/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {TaskSentService} from "../services/task-sent.service";
import {AlertService} from "../services/alert.service";
import {TaskSent} from "../interfaces/task-sent";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'update-expected-time',
  standalone: true,
  imports: [CommonModule, SelectTimeComponent, TranslateModule, MatDialogModule, MatButtonModule],
  template: `
      <div class="update-expected-time px-2" dir="auto">
          <h4 class="bold text-center mb-2">{{'update_expected_time' | translate}}</h4>
          <div class="time">
              <select-time [withMargin]='false' (calcMinutes)="time = $event" [hours]="hours || 0" [minutes]="minutes || 0"></select-time>
          </div>
          <div mat-dialog-actions class="mt-1">
              <div class="flex aic gap-x-2 w-100">
                  <button mat-dialog-close="" mat-raised-button class="flex-50 w-100 dark-color rounded cancel-btn">{{'cancel' | translate}}</button>
                  <button mat-raised-button color="primary" class="flex-50 w-100 rounded" [disabled]="!time || loading" (click)="update()">{{'save' | translate}}</button>
              </div>
          </div>
      </div>

  `,
  styles: []
})
export class UpdateExpectedTimeComponent implements OnInit {
  time: any;
  loading = false;
  hours!: number;
  minutes!: number

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private service: TaskSentService, private alert: AlertService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    let task: TaskSent = this.data.task;
    this.hours = task.expectedHours;
    this.minutes = task.expectedMinutes;
  }

  update() {
    const data = {
      id: this.data.task.id,
      expectedTime: this.time
    }
    this.service.updateExpectedTime(data).subscribe((res: any) => {
      if (res.success) {
        this.alert.showAlert('expected_time_updated');
        this.service.hasChanged.next(true);
        this.dialog.closeAll()
      }
    })
  }
}
