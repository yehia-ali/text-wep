import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {WalletService} from '../services/wallet.service';
import {CountryISO, NgxIntlTelInputModule, SearchCountryField} from "ngx-intl-tel-input";
import {AlertService} from "../services/alert.service";
import {InputLabelComponent} from "../inputs/input-label.component";
import {InputErrorComponent} from "../inputs/input-error.component";
import { ConfirmTransferComponent } from './confirm-transfer.component';

@Component({
  selector: 'send-money',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule, MatButtonModule, FormsModule, NgxIntlTelInputModule, ReactiveFormsModule, InputLabelComponent, InputErrorComponent],
  template: `
      <div class="transfer" dir="auto">
          <h3>{{'transfer_money' | translate}}</h3>
          <div mat-dialog-content>
              <form [formGroup]="form">
                  <div class="phone">
                      <input-label [control]="f['number']" key="mobile_number"/>
                      <ngx-intl-tel-input
                              [cssClass]="'input'"
                              [enableAutoCountrySelect]="false"
                              [enablePlaceholder]="false"
                              [phoneValidation]="true"
                              [preferredCountries]="[CountryISO.Egypt, CountryISO.SaudiArabia]"
                              [searchCountryField]="[SearchCountryField.Iso2, SearchCountryField.Name]"
                              [searchCountryFlag]="true"
                              [selectedCountryISO]="CountryISO.Egypt"
                              [separateDialCode]="true"
                              dir="ltr"
                              formControlName="number"
                      ></ngx-intl-tel-input>
                      <input-error [control]="f['number']"></input-error>
                  </div>
                  <div class="amount mt-50">
                      <input-label [control]="f['amount']" key="amount"/>
                      <div class="flex aic gap-x-2">
                          <input type="number" class="input w-20r" min="1" formControlName="amount">
                          <p>{{'egp' | translate}}</p>
                      </div>
                      <p class="danger fs-14 mt-75"
                         *ngIf="(form.controls['amount'].value || form.controls['amount'].value == 0) && form.controls['amount'].value < 1">{{'no_negative_amount' | translate}}</p>
                      <input-error [control]="f['amount']"></input-error>
                  </div>
              </form>
              <!--              <input type="number" class="input" [(ngModel)]="amount" [placeholder]="'enter_amount' | translate">-->
          </div>
          <div mat-dialog-actions class="pt-1">
              <button mat-raised-button color="primary" class="w-100 bold" (click)="submit()">{{'next' | translate}}</button>
          </div>
      </div>
  `,
  styles: []
})
export class TransferComponent {
  wallet: any;
  form: FormGroup;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;

  constructor(private dialog: MatDialog, private service: WalletService, private fb: FormBuilder, private alert: AlertService) {
    this.form = this.fb.group({
      number: ['', Validators.required],
      amount: [null, Validators.required]
    });
  }

  Confirm() {
    this.dialog.open(ConfirmTransferComponent, {
      width: '800px',
      height: '500',
      data: {
        wallet: this.wallet,
        amount: this.form.value.amount
      }
    });
  }

  submit() {
    if (this.form.valid) {
      this.service.getWalletInfo(this.form.value.number.e164Number.replace('+', '00')).subscribe((res: any) => {
        if (res.success) {
          if (res.data == null) {
            this.alert.showAlert("no_wallet", 'bg-danger', 4000)
            return;
          }
          this.wallet = res.data;
          this.Confirm();
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  get f() {
    return this.form.controls;
  }

}
