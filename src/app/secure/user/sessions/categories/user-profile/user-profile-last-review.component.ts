import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RateComponent} from "../../core/components/rate.component";
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'user-profile-last-review',
  standalone: true,
  template: `
  <div class="flex aic jcsb">
    <h2 class="lighter fs-25">{{'reviews' | translate}}</h2>
    <a class="underline" routerLink='/reviews'>{{'all_reviews' | translate}}</a>
  </div>
  <div class="last-review border-primary rounded py-50 px-2 flex aic gap-x-2 mt-50">
    <rate [rate]="5"/>
    <p>Great Developer and he did his work on time</p>
  </div>
  `,
  styles: [],
  imports: [CommonModule, RateComponent, TranslateModule]
})
export class UserProfileLastReviewComponent {

}
