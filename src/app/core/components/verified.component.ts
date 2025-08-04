import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'verified',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="img"><img src="assets/images/icons/verified.svg" alt="verified icon"></div>
  `,
  styles: [
  ]
})
export class VerifiedComponent {

}
