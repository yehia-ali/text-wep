import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'language',
  standalone: true,
  imports: [CommonModule],
  template: `
      <div class="flags pointer">
          <div class="img" (click)="switchLanguage('en')" *ngIf="language == 'ar'">
              <img src="assets/images/flags/en.png" alt="" width="30">
          </div>
          <div class="img" (click)="switchLanguage('ar')" *ngIf="language == 'en'">
              <img src="assets/images/flags/ar.png" alt="" width="30">
          </div>
      </div>
  `
})
export class LanguageComponent {
  language = localStorage.getItem('language') || 'en';

  constructor() {
  }

  switchLanguage(lang: string) {
    localStorage.setItem('language', lang);
    window.location.reload();
  }

}
