import { Transaction } from './../interfaces/transaction';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'loading',
  standalone: true,
  imports: [CommonModule],
  // encapsulation: ViewEncapsulation.None,
  template: `
  <div class="{{height ? 'loading-height' : ''}} {{centerd ? 'flex aic jcc' : ''}}">
    <div class="loading {{centerd ? 'loading-new flex aic jcc' : ''}}">
      <div class="effect-1 effects"></div>
      <div class="effect-2 effects"></div>
      <div class="effect-3 effects"></div>
    </div>
  </div>
  `,
  styles: [
    `
    .loading{
      z-index:1111;
      // background-color:rgba(255,255,255,0.8);

    }
    .loading-height{
      min-height:300px;
    }
    .loading-new{
      left:auto !important;
      right:auto !important;
      transform: none !important;
    }
    `
  ]
})
export class LoadingComponent {
@Input() height = false
@Input() centerd = false
}
