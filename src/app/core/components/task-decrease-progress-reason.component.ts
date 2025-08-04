import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TaskDetails} from "../interfaces/task-details";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'task-decrease-progress-reason',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="state-reason mb-1">
      <h3 class="danger">{{'decrease_reason' | translate}}: </h3>
      <p class="danger">{{details.stateReason}}</p>
    </div>
  `,
  styles: []
})
export class TaskDecreaseProgressReasonComponent {
  @Input() details!: TaskDetails;
}
