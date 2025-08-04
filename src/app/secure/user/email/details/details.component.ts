import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EmailDetailsService} from "../../../../core/services/email-details.service";
import {LayoutComponent} from "../../../../core/components/layout.component";
import {ActivatedRoute, Router} from "@angular/router";
import {MagicScrollDirective} from "../../../../core/directives/magic-scroll.directive";
import {TranslateModule} from "@ngx-translate/core";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {ArabicTimePipe} from "../../../../core/pipes/arabic-time.pipe";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDialog} from "@angular/material/dialog";
import {EmailFormComponent} from "../../../../core/components/email-form/email-form.component";

@Component({
  selector: 'email-details',
  standalone: true,
  imports: [CommonModule, LayoutComponent, MagicScrollDirective, TranslateModule, LoadingComponent, ArabicDatePipe, ArabicTimePipe, MatButtonModule, MatTooltipModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  service = inject(EmailDetailsService)
  route = inject(ActivatedRoute)
  dialog = inject(MatDialog)
  router = inject(Router)
  details: any;
  loading = true;
  detailsType: any;

  ngOnInit() {
    this.service.id.next(this.route.snapshot.params['id']);
    // get url
    this.detailsType = this.router.url.includes('inbox') ? 'inbox' : 'sent';

    this.service.getDetails(this.detailsType).subscribe((res: any) => {
      this.loading = false;
      this.details = res;
    });
  }

  forward() {
    this.dialog.open(EmailFormComponent, {
      panelClass: 'create-task-dialog',
      data: {
        isForward: true,
        messageId: this.details.messageId,
        subject: this.details.subject,
        isEdit: false,
        folder: this.detailsType == 'inbox' ? 0 : 1
      }
    })
  }

  reply() {
    this.dialog.open(EmailFormComponent, {
      panelClass: 'create-task-dialog',
      data: {
        isReply: true,
        messageId: this.details.messageId,
        subject: this.details.subject,
        folder: this.detailsType == 'inbox' ? 0 : 1
      }
    });
  }
}
