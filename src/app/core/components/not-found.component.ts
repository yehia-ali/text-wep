import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'not-found',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="not-found h-100 flex-column-center">
      <div class="img">
        <img src="assets/images/icons/not-found.svg" style="max-width:220px;" class="w-100" alt="no data">
      </div>

      <p class="mt-2 bold">{{message | translate}}</p>
    </div>
  `,
  styles: [
  ]
})
export class NotFoundComponent {
  @Input() message: string = 'no_data_found';
}
