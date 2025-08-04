import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {SessionStatus} from "../../enums/session-status";

@Component({
    selector: 'session-status',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    template: `
        <div class="session-status fs-15 rounded-4 session-{{statusEnum[sessionStatus]}}-status">
            <p>{{statusEnum[sessionStatus] | translate}}</p>
        </div>
    `,
    styles: [`
      .session-status {
        padding: 4px 16px;
      }

      .session-pending-status {
        background: rgba(236, 236, 237, 1);
      }

      .session-new-status {
        background: rgba(123, 85, 211, .1);
        color: var(--primary);
      }

      .session-missed-status {
        background: rgba(211, 47, 47, .1);
        color: #D32F2F;
      }

      .session-rejected-status {
        background: rgba(211, 47, 47, .1);
        color: #D32F2F;
      }

      .session-completed-status {
        background: rgba(41, 204, 153, .1);
        color: #29CC99;
      }

      .session-cancelled_session-status {
        background: rgba(213, 213, 213, 1);
        color: #FCFCFC;
      }

      .session-in_progress-status {
        background: rgba(255, 169, 92, 0.15);
        color: #F46850;
      }
    `]
})
export class SessionStatusComponent {
    @Input() sessionStatus!: SessionStatus;
    statusEnum = SessionStatus;

    constructor() {
    }


}
