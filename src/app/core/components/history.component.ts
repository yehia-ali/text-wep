import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArabicDatePipe} from "../pipes/arabic-date.pipe";
import {ArabicTimePipe} from "../pipes/arabic-time.pipe";
import {NotFoundComponent} from "./not-found.component";

@Component({
    selector: 'history',
    standalone: true,
  imports: [CommonModule, ArabicDatePipe, ArabicTimePipe, NotFoundComponent],
    template: `
        <div class="timeline ml-3 mb-4" *ngIf="history?.length > 0">
            <ng-container *ngFor="let historyItem of history">
                <div class="history relative">
                    <div class="date mt-1 fs-15">
                        {{historyItem.date | arabicDate}}
                    </div>
                    <div class="log mt-1">
                        <div *ngFor="let log of historyItem?.messages" class="mb-2">
                            <p class="mb-">{{log?.message}}</p>
                            <p class="muted fs-14">{{log?.creationDate | arabicTime}}</p>
                        </div>
                    </div>
                </div>
            </ng-container>
        </div>
        <div class="relative h-100" *ngIf="history?.length == 0">
          <not-found/>
        </div>
    `,
    styles: [`
      .timeline {
        .history {
          &:not(:last-of-type):before {
            content: "";
            position: absolute;
            height: calc(100% + 24px);
            top: 12px;
            inset-inline-start: -20px;
            border-inline-start: 1px dashed #ccc;
          }

          &:after {
            content: "";
            position: absolute;
            height: 10px;
            width: 10px;
            background: var(--primary);
            border-radius: 50%;
            top: 12px;
            inset-inline-start: -24.5px;
          }
        }

        .date {
          color: #C7C7CC;
        }
      }
    `]
})
export class HistoryComponent {
    @Input() history: any;
}
