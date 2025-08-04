import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TaskGroupReporter} from "../interfaces/task-group-reporter";
import {UserImageComponent} from "./user-image.component";

@Component({
  selector: 'task-group-reporters',
  standalone: true,
  imports: [CommonModule, UserImageComponent],
  template: `
      <div class="reporter-card relative rounded bg-gray p-1" *ngFor="let reporter of reporters">
          <div class="start flex aic">
              <user-image [img]="reporter.reporterProfilePicture" [id]="reporter.reporterId" (click)="$event.stopImmediatePropagation()"></user-image>
              <div class="user-info ml-1">
                  <p class="mb-25 fs-15">{{reporter.reporterName}}</p>
                  <p class="muted fs-14">{{reporter.reporterJobTitle}}</p>
              </div>
          </div>
      </div>

  `,
  styles: [`
    .reporter-card {
      &:not(:last-of-type) {
        margin-bottom: 1rem;
      }
    }

  `]
})
export class TaskGroupReportersComponent {
  @Input() reporters: TaskGroupReporter[] = [];

}
