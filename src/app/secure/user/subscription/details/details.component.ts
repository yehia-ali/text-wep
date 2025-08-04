import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialog} from "@angular/material/dialog";
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MagicScrollDirective} from "../../../../core/directives/magic-scroll.directive";
import {MatTooltipModule} from "@angular/material/tooltip";
import {RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {LayoutComponent} from "../../../../core/components/layout.component";
import {SubscriptionService} from "../../../../core/services/subscription.service";
import {SpaceConfigurationService} from 'src/app/core/services/space-configuration.service';
import {ManageSubscriptionComponent} from 'src/app/core/components/manage-subscription/manage-subscription.component';

@Component({
  selector: 'subscription-details',
  standalone: true,
  imports: [CommonModule, MagicScrollDirective, TranslateModule, MatTooltipModule, RouterLink, MatButtonModule, LayoutComponent],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [ArabicDatePipe]
})
export class DetailsComponent implements OnInit {
  details!: any;
  spaceName!: any;
  _package!: any;
  dir = document.dir;
  renewable = false;

  constructor(private service: SubscriptionService, private dialog: MatDialog, private arabicDate: ArabicDatePipe, private spaceConfigSer: SpaceConfigurationService, private translate: TranslateService) {
  }

  ngOnInit() {
    this.service.details.subscribe((data: any) => {
      this.spaceName = data?.spaceName;
      this._package = data;
      this.details = [
        {
          name: 'subscription_plan',
          value: data?.paymentPackageName,
          icon: 'plan',
        },
        {
          name: 'cost_per_user',
          value: data?.paymentPackagePricePerUser + '$',
          icon: 'cost',
        },
        {
          name: 'number_of_users',
          value: data?.totalNumberOfUser || 'unlimited',
          icon: 'people',
        },
        {
          name: 'expiry_date',
          value: data?.endDate ? this.arabicDate.transform(data?.endDate) : 'unlimited',
          icon: 'expiry-date',
        },
        {
          name: 'usage',
          value: data?.totalNumberOfUser
            ? data?.totalNumberOfUser -
            data?.availableUsers +
            '/' +
            data?.totalNumberOfUser
            : 'unlimited',
          icon: 'usage',
        },
        {name: 'total_cost', value: data?.totalPrice + ' ' + this.translate.instant('EGP'), icon: 'cost'},
      ];
      this.isExpiryDateNear(this._package?.endDate)
    })
    this.service.getSubscriptionDetails().subscribe();
  }

  renew() {
    let paymentData = {
      paymentPackageId: this._package.paymentPackageId,
      numberOfEmployees: this._package.totalNumberOfUser,
    };
    this.spaceConfigSer.updateSpacePackage(paymentData).subscribe((res: any) => {
      this.afterUpdate(res);
    })
  }

  afterUpdate(res: any) {
    if (res.success) {
      this.dialog.closeAll();
      this.service.getUnpaidOrders().subscribe(_res => {
        // this.dialog.open(OrderDetailsDialogComponent, {
        //   panelClass: 'order-details-dialog',
        //   data: {
        //     order: _res[_res.length - 1].id,
        //   }
        // })
      })
      // }
    }
  }

  // create a function that checks if the expiry date is after 5 days or less so that it can be renewable
  isExpiryDateNear(expiryDate: any) {
    const currentDate = new Date();
    const fiveDaysLater = new Date();
    fiveDaysLater.setDate(currentDate.getDate() + 5);
    if (new Date(expiryDate).getTime() <= new Date(fiveDaysLater).getTime()) {
      this.renewable = true;
    }
  }

  manageSubscription() {
    this.dialog.open(ManageSubscriptionComponent, {
      panelClass: 'manage-subscription-dialog',
      data: {
        _package: this._package
      }
    });
  }
}
