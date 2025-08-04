import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Appointment} from "../interfaces/appointment";
import {ArabicTimePipe} from "../pipes/arabic-time.pipe";

@Component({
  selector: 'session-card',
  standalone: true,
  imports: [CommonModule, ArabicTimePipe],
  template: `
    <div class="appointment">
      <div class="border-primary py-1 rounded text-center fs-14" [ngClass]="{'bg-primary white': isActive, 'primary bg-white': !isActive, 'disabled-appointment': sessionData.sessionDateStatus != 0}">
        {{sessionData.startDate | arabicTime}} - {{sessionData.endDate | arabicTime}}
      </div>
    </div>
  `,
  styles: [`
    .disabled-appointment {
      border: 1px solid #ccc !important;
      color: #ccc !important;
      pointer-events: none;
    }
  `]
})
export class SessionCardComponent {
  @Input() sessionData!: Appointment;
  @Input() isActive = false;

  constructor() { }

}
