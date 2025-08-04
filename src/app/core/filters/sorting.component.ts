import {Component, EventEmitter, Output} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sorting',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex-column-center">
      <i class='bx bx-chevron-up fs-18 pointer' (click)="sortUp()"></i>
      <i class='bx bx-chevron-down fs-18 pointer' (click)="sortDown()"></i>
    </div>
  `,
  styles: [`
    .bx {
      line-height: .6;
    }
  `]
})
export class SortingComponent {
  @Output() up = new EventEmitter<any>();
  @Output() down = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  sortUp() {
    this.up.emit(0)
  }

  sortDown() {
    this.down.emit(1)
  }

}
