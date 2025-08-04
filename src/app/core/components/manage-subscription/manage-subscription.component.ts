import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderDetailsDialogComponent} from "../order-details-dialog/order-details-dialog.component";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {PackagesService} from "../../services/packages.service";
import {SpaceConfigurationService} from "../../services/space-configuration.service";
import {AlertService} from "../../services/alert.service";
import {SubscriptionsService} from "../../services/subscriptions.service";
import {Payment} from "../../functions/payment";
import {SubscriptionService} from "../../services/subscription.service";
import {TranslateModule} from "@ngx-translate/core";
import {ArabicNumbersPipe} from "../../pipes/arabic-numbers.pipe";
import {ArabicDatePipe} from "../../pipes/arabic-date.pipe";
import {SubmitButtonComponent} from "../submit-button.component";
import {MatButtonModule} from "@angular/material/button";
import {LosingPackageComponent} from "../losing-package/losing-package.component";
import { ManageUsersComponent } from '../manage-users/manage-users.component';

@Component({
  selector: 'manage-subscription',
  standalone: true,
  imports: [CommonModule, TranslateModule, ArabicNumbersPipe, MatDialogModule, ArabicDatePipe, SubmitButtonComponent, MatButtonModule],
  templateUrl: './manage-subscription.component.html',
  styleUrls: ['./manage-subscription.component.scss']
})
export class ManageSubscriptionComponent extends Payment implements OnInit {
  _package!: any;
  packages!: any;
  selectedPackage!: any;
  numberOfEmployees!: any;
  total: any;
  price!: any;
  expiryDate: any = new Date();
  loading = false;
  spaceId = localStorage.getItem('space-id');
  packageChanged!: any;
  renewablePackage = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private packageSer: PackagesService, private service: SpaceConfigurationService, private alert: AlertService, private dialog: MatDialog, public override subscriptionSer: SubscriptionService) {
    super(subscriptionSer)
  }

  checkPackage() {
    this.packageChanged = (this.selectedPackage != this._package?.paymentPackageId) || this.data?.changePackage;
    if (!this.packageChanged) {
      if (this.numberOfEmployees < this._package.totalNumberOfUser) {
        this.numberOfEmployees = this._package.totalNumberOfUser;
      }
    }
  }

  ngOnInit(): void {
    this.subscriptionSer.getSubscriptionDetails().subscribe((_res: any) => {
      this._package = _res;
      this.isExpiryDateNear(_res.endDate);
      this.numberOfEmployees = this._package.activeUsers || this.packages[0].limitedNumberOfUser + 1;
      if (this._package.totalNumberOfUser) {
        this.numberOfEmployees = this._package.totalNumberOfUser;
      }
      this.packageSer.getPackages().subscribe((res: any) => {
        // to choose the monthly plan by default
        res.map((item: any) => {
          if (item.id == this._package.paymentPackageId) {
            this.selectPlan(item);
          }
        });
        this.packages = res;
      });
    });
  }

  selectPlan(item: any) {
    this.selectedPackage = item.id;
    if (!item.limitedNumberOfUser) {
      if (this.numberOfEmployees < 11) {
        this.numberOfEmployees = 11;
      }
    } else {
      this.total = 0;
      this.price = 0;
      this.expiryDate = null;
      this.numberOfEmployees = item.limitedNumberOfUser;
    }
    this.checkPackage();
    this.price = item.pricePerUser;
    this.total = this.numberOfEmployees * this.price;
    if (item.id != 1) {
      if (this.packageChanged) {
        this.expiryDate = new Date();
        this.expiryDate.setDate(this.expiryDate.getDate() + item.gracePeriod);
        setTimeout(() => {
          this.add();
          this.minus();
        });
      } else {
        this.expiryDate = this._package.endDate;
      }
    }
  }

  pay() {
    if (this.packageChanged && !this.renewablePackage && !this.data?.changePackage) {
      let ref = this.dialog.open(LosingPackageComponent, {
        panelClass: 'small-dialog',
        data: {}
      })
      ref.afterClosed().subscribe(res => {
        if (res) {
          this.handelPay();
        }
      });
    } else {
      this.handelPay();
    }
  }

  handelPay() {
    this.loading = true;
    const data = {
      ...(this.packageChanged && {paymentPackageId: this.selectedPackage}),
      numberOfEmployees: this.packageChanged ? this.numberOfEmployees : (this.numberOfEmployees - this._package.totalNumberOfUser),
    }
    if (this.packageChanged) {
      this.service.updateSpacePackage(data, this.spaceId).subscribe((res: any) => {
        this.afterUpdate(res);
      });
      // if package changed
    } else {
      this.service.updateNumberOfUsers(data, this.spaceId).subscribe((res: any) => {
        this.afterUpdate(res);
      });
    }
  }

  add() {
    this.numberOfEmployees++;
    let timeDifference = new Date(this.expiryDate).getTime() - new Date().getTime();
    let daysDifference = timeDifference / (1000 * 3600 * 24);
    let selectedPackageGracePeriod = this.packages.find((item: any) => item.id == this.selectedPackage)?.gracePeriod;
    let pricePerUserPerDay = (this._package.paymentPackagePricePerUser / selectedPackageGracePeriod!);
    let pricePerUser = pricePerUserPerDay * daysDifference;
    if (this.packageChanged) {
      this.total = this.numberOfEmployees * this.price;
    } else {
      this.total = ((this.numberOfEmployees - this._package.totalNumberOfUser) * pricePerUser).toFixed(2);
    }
  }

  minus() {
    let minNumber;
    if (this.packageChanged) {
      minNumber = this.packages[0].limitedNumberOfUser + 1;
    } else {
      minNumber = this._package.totalNumberOfUser;
    }
    if (this.numberOfEmployees > minNumber) {
      this.numberOfEmployees = this.numberOfEmployees - 1;
      let timeDifference = new Date(this.expiryDate).getTime() - new Date().getTime();
      let daysDifference = timeDifference / (1000 * 3600 * 24);
      let selectedPackageGracePeriod = this.packages.find((item: any) => item.id == this.selectedPackage)?.gracePeriod;
      let pricePerUserPerDay = (this._package.paymentPackagePricePerUser / selectedPackageGracePeriod!);
      let pricePerUser = pricePerUserPerDay * daysDifference;
      if (this.packageChanged) {
        this.total = this.numberOfEmployees * this.price;
      } else {
        if (this.numberOfEmployees == this._package.totalNumberOfUser) {
          this.total = 0;
        } else {
          this.total = ((this.numberOfEmployees - this._package.totalNumberOfUser) * pricePerUser).toFixed(2);
        }
      }
    }
  }

  deactivate() {
    let ref = this.dialog.open(ManageUsersComponent, {
      panelClass: 'manage-users-dialog',
      disableClose: true
    })

    ref.afterClosed().subscribe(res => {
      this._package.activeUsers = res;
    });
  }

  afterUpdate(res: any) {
    if (res.success) {
      if (res.data.paymentPackageId == 1) {
        this.alert.showAlert('space_updated');
        this.subscriptionSer.getSubscriptionDetails().subscribe()
      } else {
        this.subscriptionSer.getUnpaidOrders().subscribe(_res => {
          this.dialog.open(OrderDetailsDialogComponent, {
            panelClass: 'order-details-dialog',
            data: {
              order: _res[_res.length - 1].id,
            }
          })
        })
      }
      this.dialog.closeAll();
      // }
    } else {
      this.loading = false
    }
  }

  // create a function that checks if the expiry date is after 5 days or less so that it can be renewable
  isExpiryDateNear(expiryDate: any) {
    const currentDate = new Date();
    const fiveDaysLater = new Date();
    fiveDaysLater.setDate(currentDate.getDate() + 5);
    if (new Date(expiryDate).getTime() <= new Date(fiveDaysLater).getTime()) {
      this.renewablePackage = true;
    }
  }

}
