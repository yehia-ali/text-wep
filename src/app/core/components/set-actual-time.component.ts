import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {TaskDetailsService} from "../services/task-details.service";
import {AlertService} from "../services/alert.service";
import {SelectTimeComponent} from "./select-time.component";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'set-actual-time',
  standalone: true,
  imports: [CommonModule, TranslateModule, SelectTimeComponent, MatDialogModule, MatButtonModule],
  template: `
      <div class="set-actual-time" dir="auto">
          <h2 class="black text-center mb-1">{{'actual_time' | translate}}</h2>
          <div class="time">
              <select-time (calcMinutes)="time = $event"></select-time>
          </div>
          <div class="mt-1" mat-dialog-actions>
              <div class="flex aic gap-x-2 w-100">
                  <button mat-dialog-close="" mat-raised-button class="flex-50 w-100 dark-color rounded cancel-btn">{{'cancel' | translate}}</button>
                  <button mat-raised-button color="primary" class="flex-50 w-100 rounded" [disabled]="!time || disabled" (click)="updateProgress()">{{'save' | translate}}</button>
              </div>
          </div>
      </div>

  `,
  styles: []
})
export class SetActualTimeComponent {
  time: any;
  disabled = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private service: TaskDetailsService, private alert: AlertService, private dialogRef: MatDialogRef<SetActualTimeComponent> ) {
  }

  ngOnInit(): void {
  }
  update(){
    this.disabled = true;
    const data = {
      id: this.data.task.taskId,
      actualTime: this.time,
      percentage: 100
    };
    this.service.updateTaskProgress(data).subscribe((res: any) => {
      if (res.success) {
        this.alert.showAlert('task_updated');
        this.service.hasChanged.next(true);
        this.dialogRef.close({success:true});
      }
      this.disabled = false;
    });
  }
  updateProgress() {
    if(this.data.task.taskGroupType == 5){
      if (this.data.task.inLocation) {
        this.update()
      } else {
        this.alert.showAlert('not_in_location', 'bg-danger', 5000);
        this.dialogRef.close({success:false});
        document.body.click();
      }
    }else{
      this.update()
    }

  }
}
