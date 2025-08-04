import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'wallet-type',
  standalone: true,
  imports: [CommonModule, NgSelectModule, TranslateModule, FormsModule],
  template: `
    <div class="wallet-type">
      <label class="fs-14">{{'type' | translate}}</label>
      <ng-select class="w-18r" appendTo="body" [items]="walletTypes" bindLabel="title" bindValue="value" [(ngModel)]="selectedValue" (ngModelChange)="filter($event)">
        <ng-template ng-option-tmp let-item="item">
          <span>{{item.title | translate}}</span>
        </ng-template>
        <ng-template ng-label-tmp let-item="item" let-clear="clear">
          <span class="fs-14">{{item.title | translate}}</span>
        </ng-template>
      </ng-select>
    </div>
  `,
  styles: [
  ]
})
export class WalletTypeComponent {
  @Output() valueChanged = new EventEmitter();
  selectedValue = null;
  walletTypes = [
    { title: 'payment', value: 0 },
    { title: 'added_Fund', value: 1 },
    { title: 'transfer', value: 3 }
  ]

  filter(event: any) {
    this.valueChanged.emit(event);
  }
}
