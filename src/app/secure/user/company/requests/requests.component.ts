import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from "../../../../core/components/layout.component";
import {MagicScrollDirective} from "../../../../core/directives/magic-scroll.directive";
import {UserImageComponent} from "../../../../core/components/user-image.component";
import {TranslateModule} from "@ngx-translate/core";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {AlertService} from "../../../../core/services/alert.service";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../../../../core/services/user.service";
import {ConfirmationMessageComponent} from "../../../../core/dialogs/confirmation-message.component";
import {SpaceRequest} from "../../../../core/interfaces/space-request";
import {SpaceRequestService} from "../../../../core/servicess/space-request.service";
import {ManageSubscriptionComponent} from "../../../../core/components/manage-subscription/manage-subscription.component";
import {RolesService} from "../../../../core/services/roles.service";

@Component({
  selector: 'requests',
  standalone: true,
  imports: [CommonModule, LayoutComponent, MagicScrollDirective, UserImageComponent, TranslateModule, MatTooltipModule, NotFoundComponent, LoadingComponent],
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  requests: SpaceRequest[] = [];
  loading = false;
  dir = document.dir;
  canAccessAdmin = false;

  constructor(
    private service: SpaceRequestService,
    private alert: AlertService,
    private dialog: MatDialog,
    private rolesSer: RolesService
  ) {
  }

  ngOnInit(): void {
    this.rolesSer.canAccessAdmin.subscribe((res) => this.canAccessAdmin = res);
    this.service.spaceRequests.subscribe((res) => {
      this.requests = res;
      if (this.requests.length > 0) {
        this.loading = false;
      }
    });

    if (this.requests.length == 0) {
      this.getRequests();
    }
  }

  getRequests() {
    this.loading = true;
    this.service.getSpaceRequests().subscribe(() => {
      this.loading = false;
    });
  }

  approveSpaceRequest(id: number) {
    const data = {
      id: id,
      isApproved: true,
    };
    this.service.approveOrRejectSpace(data).subscribe((res: any) => {
      if (res.success) {
        this.alert.showAlert('space_accepted');
        this.service.getSpaceRequests().subscribe();
      } else {
        if (this.canAccessAdmin) {
          this.dialog.open(ManageSubscriptionComponent, {
            panelClass: 'manage-subscription-dialog',
          })
        }
      }
    });
  }

  rejectSpaceRequest(id: number) {
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      data: {
        id,
        message: 'space_message',
        btn_name: 'confirm',
        classes: 'bg-primary white',
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        const data = {
          id,
          isApproved: false
        }
        this.service.approveOrRejectSpace(data).subscribe(res => {
          this.alert.showAlert('space_rejected');
          this.service.getSpaceRequests().subscribe();
        })
      }
    });
  }

  trackBy(index: any, item: any) {
    return item.taskId;
  }
}
