import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'vote-status',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="chip rounded fs-13 text-center {{classes}}"
         [ngClass]="{'chip-light-danger': state == 2, 'chip-light-warning': state == 3, 'chip-light-success': state == 4, 'chip-light-canceled': state == 1}"
    >
      <span *ngIf="state == 1">{{'canceled' | translate}}</span>
      <span *ngIf="state == 2">{{'missed' | translate}}</span>
      <span *ngIf="state == 3">{{'un-voted' | translate}}</span>
      <span *ngIf="state == 4">{{'voted' | translate}}</span>
    </div>

  `,
  styles: []
})
export class VoteStatusComponent {
  @Input() state!: number;
  @Input() classes!: string;
}
