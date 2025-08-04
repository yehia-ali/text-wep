import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TaskDetails} from "../interfaces/task-details";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'task-description',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <p class="fs-16 bold">{{'description' | translate}}</p>
    <p class="mt-1 contains-link word-break" [innerHTML]="task.description" *ngIf="task.description"></p>
    <div class="sound mt-1" *ngIf="task.soundDescription">
      <audio controls="controls" class="w-100 rounded border">
        <source src="{{task.soundDescription}}" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
    </div>

  `,
  styles: [
  ]
})
export class TaskDescriptionComponent {
  @Input() task!: TaskDetails;

}
