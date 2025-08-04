import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {WalletService} from '../services/wallet.service';
import {InputErrorComponent} from "../inputs/input-error.component";
import {SubmitButtonComponent} from "./submit-button.component";

@Component({
  selector: 'add-fund',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule, MatButtonModule, FormsModule, ReactiveFormsModule, InputErrorComponent, SubmitButtonComponent],
  template: `
    <div class="add-fund" dir="auto">
      <h3>{{'top-up' | translate}}</h3>
      <div mat-dialog-content>
        <form [formGroup]="form">
          <div class="flex aic gap-x-2">
            <input type="number" min="1" [placeholder]="'enter_amount' | translate" class="input w-20r" formControlName="balance">
            <p>{{'egp' | translate}}</p>
          </div>
          <p class="danger fs-14 mt-75" *ngIf="(form.controls['balance'].value || form.controls['balance'].value == 0) && form.controls['balance'].value < 1">{{'no_negative' | translate}}</p>
          <input-error [control]="form.controls['balance']"></input-error>
        </form>
      </div>
      <div mat-dialog-actions>
        <button mat-raised-button color="primary" [disabled]="loading" class="w-100 bold" (click)="submit()">
          <submit-button [loading]="loading" text="add"/>
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class TopUpComponent {
  form: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private service: WalletService) {
    this.form = this.fb.group({
      balance: [null, [Validators.required]]
    });
  }

  submit() {
    if (this.form.valid && this.form.value.balance > 0) {
      this.loading = true;
      this.service.addBalance(this.form.value.balance).subscribe((res: any) => {
        if (res.success) {
          sessionStorage.setItem('paymentUrl', res.data);
          location.href = res.data
        }
      });
    } else {
      this.form.markAllAsTouched();
    }

  }
}
