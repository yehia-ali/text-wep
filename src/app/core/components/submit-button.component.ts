import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'submit-button',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <span *ngIf="!loading" class="fs-14 simibold">{{text | translate}}</span>
    <p *ngIf="loading" class="flex aic jcc">
      <i class='bx bx-loader-circle bx-spin bx-rotate-90 mr-50 fs-20'></i>
      <span class="fs-16">{{'loading' | translate}}</span>
    </p>
  `,
  styles: []
})
export class SubmitButtonComponent {
  @Input() loading!: boolean;
  @Input() text: string = '';
}
