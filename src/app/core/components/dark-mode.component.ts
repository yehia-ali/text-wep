import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'dark-mode',
  standalone: true,
  imports: [CommonModule],
  template: `
      <div class="mode pointer line-height">
          <i (click)="switchMode('dark')" *ngIf="mode == 'light'" class='bx bx-moon fs-25'></i>
          <i (click)="switchMode('light')" *ngIf="mode == 'dark'" class='bx bx-sun fs-25'></i>
      </div>
  `,
  styles: []
})
export class DarkModeComponent {
  mode = localStorage.getItem('mode') || 'light';

  switchMode(mode: string) {
    localStorage.setItem('mode', mode);
    this.mode = mode;
    mode == 'dark' ? document.body.classList.add('dark-mode') : document.body.classList.remove('dark-mode')
  }

}
