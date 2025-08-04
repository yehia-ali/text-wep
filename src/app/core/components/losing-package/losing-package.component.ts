import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'losing-package',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule, MatButtonModule],
  template: `
    <div mat-dialog-content>
      <i class='bx bx-error-alt flex-center danger mb-1' style="font-size: 10rem;"></i>
      <p class="text-center fs-17">{{ 'losing_subscription' | translate }}</p>
    </div>

    <div mat-dialog-actions class="w-100">
      <div class="flex aic jcsb w-100 gap-x-1">
        <button mat-raised-button [mat-dialog-close]="false" class="flex-50">{{ 'cancel' | translate }}</button>
        <button mat-raised-button color="warn" [mat-dialog-close]="true" class="flex-50">{{ 'confirm' | translate }}</button>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class LosingPackageComponent {

}
