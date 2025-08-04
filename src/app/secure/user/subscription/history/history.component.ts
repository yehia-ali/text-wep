import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutWithSidebarModule} from "../../../../core/components/layout-with-sidebar/layout-with-sidebar.module";
import {RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {MagicScrollDirective} from "../../../../core/directives/magic-scroll.directive";
import {ArabicNumbersPipe} from "../../../../core/pipes/arabic-numbers.pipe";
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {SubscriptionService} from "../../../../core/services/subscription.service";
import {MatDialog} from "@angular/material/dialog";
import {LoadingComponent} from "../../../../core/components/loading.component";
import { OrderDetailsDialogComponent } from 'src/app/core/components/order-details-dialog/order-details-dialog.component';
import {NotFoundComponent} from "../../../../core/components/not-found.component";

@Component({
  selector: 'history',
  standalone: true,
  imports: [CommonModule, LayoutWithSidebarModule, RouterLink, TranslateModule, MagicScrollDirective, ArabicNumbersPipe, ArabicDatePipe, LoadingComponent, NotFoundComponent],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  orders!: any;
  loading = false;
  status = [
    {title: 'all', value: null},
    {title: 'paid', value: 1},
    {title: 'unpaid', value: 0}
  ];
  dir = document.dir;


  constructor(public service: SubscriptionService, private dialog: MatDialog) {
  }

  getHistory() {
    this.loading = true;
    this.service.billingHistory().subscribe(res => {
      this.orders = res;
      this.loading = false;
    })
  }

  filter(value: any) {
    this.service.paymentStatus.next(value)
    this.getHistory()
  }

  ngOnInit(): void {
    this.getHistory();
  }

  orderDetails(order: any) {
    this.dialog.open(OrderDetailsDialogComponent, {
      panelClass: 'order-details-dialog',
      data: {
        order
      }
    })
  }

}
