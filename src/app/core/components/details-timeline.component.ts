import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {ArabicDatePipe} from "../pipes/arabic-date.pipe";
import {TaskWorkingHoursComponent} from "./task-working-hours.component";

@Component({
    selector: 'details-timeline',
    standalone: true,
    imports: [CommonModule, TranslateModule, ArabicDatePipe, TaskWorkingHoursComponent],
    template: `
        <div class="task-timeline mb-1 py-2 pr-2 pl-4 bg-gray rounded">
            <div class="timeline relative">
                <div class="start mb-2">
                    <h4>{{'start_date' | translate}}</h4>
                    <p class="fs-14">{{details.startDate | arabicDate:'withTime'}}</p>
                </div>

                <task-working-hours [workingHours]="details.workingHours" [dashboard]="false"></task-working-hours>

                <div class="end mt-2">
                    <h4>{{'due_date' | translate}}</h4>
                    <p class="fs-14">{{details.endDate | arabicDate:'withTime'}}</p>
                </div>
            </div>
        </div>

    `,
    styles: [`
      .task-timeline {
        .timeline {
          &:before {
            content: "";
            position: absolute;
            top: 10px;
            inset-inline-start: -15px;
            height: calc(100% - 48px);
            width: 2px;
            border-inline-start: 2px dashed #e0e0e0;
          }

          .start, .end {
            position: relative;

            &:before {
              content: '';
              position: absolute;
              top: 5px;
              inset-inline-start: -19px;
              width: 1rem;
              height: 1rem;
              border-radius: 50%;
            }
          }

          .start {
            &:before {
              background: #C7C7CC;
            }
          }

          .end {
            &:before {
              background: #CF4747;
            }
          }

        }
      }
    `]
})
export class DetailsTimelineComponent {
    @Input() details!: any;

}
