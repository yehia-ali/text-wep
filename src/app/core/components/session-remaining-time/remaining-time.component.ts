import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'remaining-time',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="flex-center" *ngIf="remainingTime">
            <div class="red-dot mr-75"></div>
            <p>{{remainingTime}}</p>
        </div>
    `,
    styles: [`
      .red-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background-color: #ea5455;
      }
    `]
})
export class RemainingTimeComponent {
    @Input() remainingTime!: string;
}
