import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatMenuModule} from "@angular/material/menu";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'task-vote-sort',
  standalone: true,
  imports: [CommonModule, MatMenuModule, TranslateModule],
  template: `
      <div class="sort" [dir]="dir">
          <div class="img pointer" [matMenuTriggerFor]="menu">
              <img src="assets/images/icons/sort.svg" alt="" class="convert-image-color">
          </div>

          <mat-menu #menu="matMenu" class="sort-menu">
              <button mat-menu-item *ngFor="let item of types" [ngClass]="{'active': selectedValue == item.value}"
                      (click)="sort(item.value)">{{item.name | translate}}</button>
          </mat-menu>
      </div>
  `,
  styles: []
})
export class TaskVoteSortComponent {
  @Output() sortChanged = new EventEmitter();
  @Input() selectedValue = 0;
  dir: any = document.dir;
  types = [
    {name: 'most_recent', value: 0},
    {name: 'start_date', value: 1},
    {name: 'priority', value: 2},
    {name: 'remaining_time', value: 3},
  ]

  sort(res: any) {
    this.selectedValue = res;
    this.sortChanged.emit(this.selectedValue)
  }

}
