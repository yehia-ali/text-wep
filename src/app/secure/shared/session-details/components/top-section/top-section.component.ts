import {Component, Input, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatMenuModule} from "@angular/material/menu";
import {TranslateModule} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {Subscription} from "rxjs";
import {SessionStatusComponent} from "../../../../../core/components/session-status/session-status.component";
import {RateComponent} from "../../../../../core/components/rate.component";
import {InfoSidebarComponent} from "../../../../../core/components/info-sidebar.component";
import {SessionDetails} from "../../../../../core/interfaces/session-details";
import {SessionDetailsService} from "../../../../../core/services/session-details.service";
import {AlertService} from "../../../../../core/services/alert.service";
import {ConfirmationMessageComponent} from "../../../../../core/dialogs/confirmation-message.component";
import {HistoryComponent} from "../../../../../core/components/history.component";
import {RaiseIssueComponent} from 'src/app/core/components/raise-issue/raise-issue.component';
import {AddRateComponent} from "../../../../../core/components/add-rate.component";

@Component({
    selector: 'top-section',
    standalone: true,
    imports: [CommonModule, SessionStatusComponent, MatMenuModule, TranslateModule, RateComponent, InfoSidebarComponent, HistoryComponent, AddRateComponent],
    templateUrl: './top-section.component.html',
    styleUrls: ['./top-section.component.scss']
})
export class TopSectionComponent implements OnDestroy {
    @Input() session!: SessionDetails;
    historyIsOpen = false;
    history: any;
    source1$!: Subscription;

    constructor(private service: SessionDetailsService, private dialog: MatDialog, private alert: AlertService) {

    }

    cancelSession() {
        let ref = this.dialog.open(ConfirmationMessageComponent, {
            panelClass: 'confirmation-dialog',
            data: {
                btn_name: 'confirm',
                message: 'cancel_session_message',
                classes: 'bg-danger white'
            }
        });
        ref.afterClosed().subscribe((res: any) => {
            if (res) {
                this.service.cancelSession().subscribe((res: any) => {
                    if (res.success) {
                        this.alert.showAlert('session_cancelled')
                        this.service.hasChanged.next(true);
                    }
                })
            }
        });
    }

    raiseIssue() {
        this.dialog.open(RaiseIssueComponent, {
            width: '600px',
            panelClass: 'raise-issue-dialog',
            data: {
                session: this.session
            }
        })
    }

    getHistory() {
        this.historyIsOpen = false;
        setTimeout(() => {
            this.historyIsOpen = true;
        }, 0);
        this.source1$ = this.service.getHistory().subscribe(res => this.history = res);
    }

    ngOnDestroy() {
        if (this.source1$) this.source1$.unsubscribe();
    }
}
