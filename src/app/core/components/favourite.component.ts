import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'favourite',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="img pointer" (click)="valueChanged()">
      <img src="assets/images/icons/fav.svg" *ngIf="!isFavourite" alt="">
      <img src="assets/images/icons/fav-fill.svg" *ngIf="isFavourite" alt="">
    </div>
  `,
  styles: []
})
export class FavouriteComponent {
  @Input() isFavourite = false;
  @Output() getValue = new EventEmitter();

  valueChanged() {
    this.isFavourite = !this.isFavourite;
    this.getValue.emit(this.isFavourite);
  }
}
