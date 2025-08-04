import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'filter-label',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <label class="fs-11 simibold">{{key | translate}}</label>
  `,
  styles: [
  ]
})
export class FilterLabelComponent {
  @Input() key = ''
}
