import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogModule} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'payment-required',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule, MatButtonModule],
  template: `
    <div mat-dialog-content>
      <p class="text-center fs-17">{{ 'payment_required' | translate }}</p>
    </div>

    <div mat-dialog-actions class="w-100 flex-center gap-x-2">
      <div class="flex-center w-100">
        <button mat-raised-button color="primary" mat-dialog-close class="px-4">{{ 'check_spaces' | translate }}</button>
      </div>
    </div>
  `,
  styles: []
})
export class PaymentRequiredComponent {

}
