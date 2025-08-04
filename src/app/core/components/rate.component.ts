import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArabicNumbersPipe} from "../pipes/arabic-numbers.pipe";

@Component({
  selector: 'rate',
  standalone: true,
  imports: [CommonModule, ArabicNumbersPipe],
  template: `
      <div class="flex aic {{size}}" [ngClass]="{'gap-x-1': type == 'large'}">
          <div class="rate flex aic" *ngIf="type == 'large'">
              <div class="rate-1 img">
                  <i class='bx bx-star' *ngIf="rate < 0.5"></i>
                  <i class='bx bxs-star-half warning' *ngIf="rate >= 0.5 && rate < 1"></i>
                  <i class='bx bxs-star warning' *ngIf="rate >= 1"></i>
              </div>
              <div class="rate-2 img">
                  <i class='bx bx-star' *ngIf="rate < 1.5"></i>
                  <i class='bx bxs-star-half warning' *ngIf="rate >= 1.5 && rate < 2"></i>
                  <i class='bx bxs-star warning' *ngIf="rate >= 2"></i>
              </div>
              <div class="rate-3 img">
                  <i class='bx bx-star' *ngIf="rate < 2.5"></i>
                  <i class='bx bxs-star-half warning' *ngIf="rate >= 2.5 && rate < 3"></i>
                  <i class='bx bxs-star warning' *ngIf="rate >= 3"></i>
              </div>
              <div class="rate-4 img">
                  <i class='bx bx-star' *ngIf="rate < 3.5"></i>
                  <i class='bx bxs-star-half warning' *ngIf="rate >= 3.5 && rate < 4"></i>
                  <i class='bx bxs-star warning' *ngIf="rate >= 4"></i>
              </div>
              <div class="rate-5 img">
                  <i class='bx bx-star' *ngIf="rate < 4.5"></i>
                  <i class='bx bxs-star-half warning' *ngIf="rate >= 4.5 && rate < 5"></i>
                  <i class='bx bxs-star warning' *ngIf="rate >= 5"></i>
              </div>
          </div>
          <i class='bx bxs-star mr-50' [ngClass]="{'warning': rate}" *ngIf="type == 'small'"></i>
          <p class="fs-15" *ngIf="(displayNumber || type == 'small') && rate">{{rate | number:'1.1-1'}}</p>
          <p class="fs-15" *ngIf="(displayNumber || type == 'small') && !rate">{{0 | arabicNumbers}}.{{0 | arabicNumbers}}</p>
      </div>
  `,
  styles: []
})
export class RateComponent {
  @Input() rate = 1;
  @Input() size = '';
  @Input() type = 'large';
  @Input() displayNumber = true;
}
