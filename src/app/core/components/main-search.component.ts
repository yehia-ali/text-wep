import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'main-search',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
      <div class="search relative">
          <i class="bx bx-search"></i>
          <input type="text" [placeholder]="'search_taskedin' | translate" class="search-input w-100">
          <i class="bx bx-slider"></i>
      </div>
  `,
  styles: [`
    .search-input {
      padding-inline: 6rem;
      font-size: 1.7rem;
    }

    .bx-search, .bx-slider {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 2.5rem;
    }

    .bx-search {
      inset-inline-start: 2rem;
    }

    .bx-slider {
      inset-inline-end: 2rem;
    }
  `]
})
export class MainSearchComponent {

}
