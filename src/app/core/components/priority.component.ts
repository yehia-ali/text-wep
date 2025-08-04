import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'priority',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="priority">
      <div class="img">
        <img *ngIf="priority == 0" src="assets/images/priority/low.svg" alt="low" [width]="size">
        <img *ngIf="priority == 1" src="assets/images/priority/medium.svg" alt="medium" [width]="size">
        <img *ngIf="priority == 2" src="assets/images/priority/high.svg" alt="high" [width]="size">
      </div>
    </div>

  `,
  styles: []
})
export class PriorityComponent {
  @Input() priority!: any;
  @Input() size = 14;
}
