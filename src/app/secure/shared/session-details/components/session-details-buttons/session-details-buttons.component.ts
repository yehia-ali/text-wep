import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialog} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {SessionDetails} from "../../../../../core/interfaces/session-details";
import {SessionDetailsService} from "../../../../../core/services/session-details.service";
import {AlertService} from "../../../../../core/services/alert.service";
import {ConfirmationMessageComponent} from "../../../../../core/dialogs/confirmation-message.component";

@Component({
    selector: 'session-details-buttons',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './session-details-buttons.component.html',
    styleUrls: ['./session-details-buttons.component.scss']
})
export class SessionDetailsButtonsComponent {
    @Input() session!: SessionDetails

    constructor(private dialog: MatDialog, private service: SessionDetailsService, private alert: AlertService) {
    }

    approveRequest(id: number) {
        let ref = this.dialog.open(ConfirmationMessageComponent, {
            panelClass: 'confirmation-dialog',
            data: {
                btn_name: 'confirm',
                message: 'approve_session_request_message',
                classes: 'bg-primary white'
            }
        });
        ref.afterClosed().subscribe((res: any) => {
            if (res) {
                this.service.approveRequest(id).subscribe((res: any) => {
                    if (res.success) {
                        this.service.hasChanged.next(true);
                    }
                });
            }
        });
    }

    rejectRequest(id: number) {
        let ref = this.dialog.open(ConfirmationMessageComponent, {
            panelClass: 'confirmation-dialog',
            data: {
                btn_name: 'confirm',
                message: 'reject_session_request_message',
                classes: 'bg-danger white'
            }
        });
        ref.afterClosed().subscribe((res: any) => {
            if (res) {
                this.service.rejectRequest(id).subscribe((res: any) => {
                    if (res.success) {
                        this.service.hasChanged.next(true);
                    }
                });
            }
        });
    }

    startSession() {
        if (this.session.sessionAttendeesStatus == 2 && this.session.isConsultant) {
            this.service.startSession().subscribe((res: any) => {
                if (res.success) {
                    this.openSession()
                }
            });
        } else {
            this.openSession()
        }
    }

    openSession() {
        this.service.openSession(this.session.sessionDateId).subscribe((res: any) => {
            if (res.success) {
                this.service.hasChanged.next(true);
                window.open(res.data, '_blank')
            }
        });
    }

    endSession() {
        this.service.endSession().subscribe((res: any) => {
            if (res.success) {
                this.service.hasChanged.next(true);
                this.alert.showAlert('session_ended_successfully')
            }
        });
    }

    getRecord() {
        this.service.getRecord(this.session.sessionDateId).subscribe((res: any) => {
            if (res.success) {
                this.service.hasChanged.next(true);
                window.open(res.data, '_blank')
            }
        });
    }
}
