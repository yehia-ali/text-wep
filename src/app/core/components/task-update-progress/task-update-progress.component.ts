import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TaskDetails} from "../../interfaces/task-details";
import {TranslateModule} from "@ngx-translate/core";
import {ArabicNumbersPipe} from "../../pipes/arabic-numbers.pipe";
import {MatSliderModule} from "@angular/material/slider";
import {TaskDetailsService} from "../../services/task-details.service";
import {AlertService} from "../../services/alert.service";
import {MatDialog} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {SetActualTimeComponent} from "../set-actual-time.component";
import {DecreaseReasonComponent} from "../decrease-reason.component";

@Component({
  selector: 'task-update-progress',
  standalone: true,
  imports: [CommonModule, TranslateModule, ArabicNumbersPipe, MatSliderModule, FormsModule],
  templateUrl: './task-update-progress.component.html',
  styleUrls: ['./task-update-progress.component.scss']
})
export class TaskUpdateProgressComponent implements OnChanges {
  @Input() details!: TaskDetails|any;
  @Output() progressUpdated = new EventEmitter<void>();
  actualProgress!: any;
  disabled = true;
  actual: any;
  dir: any = document.dir
  progress: any;
  creator: boolean;

  constructor(private service: TaskDetailsService, private alert: AlertService, private dialog: MatDialog) {

  }

  ngOnInit(){
    if(this.details?.taskGroupCreatorId == localStorage.getItem('id')){
      this.creator = true
    }else{
      this.creator = false
    }
  }

  ngOnChanges() {
    this.actualProgress = this.details.percentage;
    this.progress = this.details.percentage
  }

  openActualDialog() {
    if (this.details.percentage == 100 && !this.details.logsFlag) {
      this.dialog.open(SetActualTimeComponent, {
        panelClass: 'small-dialog',
        data: {
          task: this.details
        },
      });
      this.dialog.afterAllClosed.subscribe(res => {
        this.disabled = true;
        this.details.percentage = this.actualProgress
        this.progressUpdated.emit();
      })
    }
  }

  progressValue() {
    if (this.creator && !this.details.isAssignee && this.actualProgress > this.details.percentage) {
      let ref = this.dialog.open(DecreaseReasonComponent, {
        panelClass: 'decrease-reason-dialog'
      })
      ref.afterClosed().subscribe(res => {
        if (res) {
          this.updateProgress(res)
          this.progressUpdated.emit();
        }
      })
    } else {
      this.updateProgress()
    }
  }

  updateProgress(stateReason = null) {
    this.disabled = true;
    let actual = this.details.logsFlag ? this.details.logsMinuts :  null;

    const data = {
      id: this.details.taskId,
      ...(this.details.percentage == 100 && {actualTime: actual}),
      percentage: this.details.percentage,
      stateReason: stateReason
    };
    this.actual = null;

    this.service.updateTaskProgress(data).subscribe((res: any) => {
      if (res.success) {
        this.alert.showAlert('task_updated');
        this.service.hasChanged.next(true)
        this.progressUpdated.emit();
      }
    });
  }
}
