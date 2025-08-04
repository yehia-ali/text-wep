import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ArabicDatePipe} from "../../pipes/arabic-date.pipe";
import {Payment} from "../../functions/payment";
import {SubscriptionService} from '../../services/subscription.service';
import {ArabicNumbersPipe} from "../../pipes/arabic-numbers.pipe";
import {jsPDF} from "jspdf";
import html2canvas from "html2canvas";
import { ManageSubscriptionComponent } from '../manage-subscription/manage-subscription.component';

@Component({
  selector: 'order-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, TranslateModule, ArabicNumbersPipe],
  providers: [ArabicDatePipe],
  template: `
    <div class="order-details" dir="auto">
      <div class="flex aic jcsb">
        <h2 class="bold">{{ 'order_details' | translate }}</h2>
        <button mat-raised-button (click)="exportPDF()" class="pdf-btn m-2">{{ 'export' | translate }}</button>
      </div>

      <div mat-dialog-content class="mt-3 mb-1" #invoice>
        <div class="flex aic jcsb w-100 cards pb-3">
          <div *ngFor="let item of order">
            <p>{{ item.title | translate }}</p>
            <p class="text-center bold mt-2">{{ item.value }}</p>
          </div>
        </div>
        <div class="amount mt-3 flex aic w-50 mx-auto jcsb">
          <p>{{ 'amount' | translate }}</p>

          <p>{{ amount | arabicNumbers }} {{ 'EGP' | translate }}</p>
        </div>
      </div>
      <div class="flex pb-2">
        <button mat-raised-button class="rounded-5 w-40 mx-auto mt-4 flex-center" *ngIf="data?.welcome" (click)="manageSubscription()">{{ 'manage_subscription' | translate }}</button>
        <button mat-raised-button color="primary" class="rounded-5 w-40 mx-auto mt-4 flex-center" (click)="pay()" *ngIf="orderStatus == 0">{{ 'pay_now' | translate }}</button>
      </div>
    </div>
  `,
  styles: [`
    .cards {
      border-bottom: 2px dashed #787777;
    }

    button {
      padding: .6rem;
    }

    .pdf-btn {
      height: 4rem !important;
      padding: 0 2rem !important;
      background: #d93f2d !important;
      color: white !important;
    }
  `]
})
export class OrderDetailsDialogComponent extends Payment implements OnInit {
  @ViewChild('invoice') invoiceElement!: ElementRef;
  order!: any;
  amount!: any;
  status!: any;
  orderStatus = 1;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public service: SubscriptionService, private arabicDate: ArabicDatePipe, private arabicNumbers: ArabicNumbersPipe, private translate: TranslateService, private dialog: MatDialog) {
    super(service);
  }

  ngOnInit(): void {
    this.service.getOrderDetails(this.data.order).subscribe((res: any) => {
      this.amount = res.price;
      this.status = res.paymentSubscriptionStatus;
      this.orderStatus = res.paymentStatus;
      this.order = [
        {title: 'order_id', value: res.id},
        {title: 'plan_name', value: this.translate.instant(res.paymentPackageName)},
        {title: 'status', value: res.paymentStatus == 1 ? this.translate.instant('payment_paid') : this.translate.instant('payment_unpaid')},
        {title: 'gateway', value: res.getaway},
        {title: 'date', value: this.arabicDate.transform(res.startDate)},
        {title: 'users_number', value: this.arabicNumbers.transform(res.numberOfUser || 0)},
      ]
    })
  }

  manageSubscription() {
    this.dialog.closeAll();
    this.dialog.open(ManageSubscriptionComponent, {
      panelClass: 'manage-subscription-dialog',
      data: {
        changePackage: true
      }
    })
  }

  pay() {
    this.goToPay(this.status, this.data.order);
  }

  exportPDF() {
    html2canvas(this.invoiceElement.nativeElement, {scale: 5}).then((canvas: any) => {
      const imageGeneratedFromTemplate = canvas.toDataURL('image/png');
      const fileWidth = 200;
      const generatedImageHeight = (canvas.height * fileWidth) / canvas.width;
      let PDF = new jsPDF('p', 'mm', 'a4',);
      PDF.addImage(imageGeneratedFromTemplate, 'PNG', 0, 5, fileWidth, generatedImageHeight,);
      PDF.html(this.invoiceElement.nativeElement.innerHTML)
      PDF.save(`invoice-${this.data.order}.pdf`);
    });
  }
}
