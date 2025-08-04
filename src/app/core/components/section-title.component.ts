import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'section-title',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
      <div class="section-title py-1 border-bottom">
          <h2 class="text-center fs-20 primary">{{text | translate}}</h2>
      </div>
  `,
  styles: [
  ]
})
export class SectionTitleComponent {
  @Input() text: string = '';
}
