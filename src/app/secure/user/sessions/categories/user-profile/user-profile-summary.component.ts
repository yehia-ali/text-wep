import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'user-profile-summary',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <h2 class="lighter fs-18">{{'summary' | translate}}</h2>
    <p class="mt-1">{{summary}}</p>
  `,
  styles: []
})
export class UserProfileSummaryComponent {
  @Input() summary!: string;
}
