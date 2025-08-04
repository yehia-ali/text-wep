import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'task-status',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div
      [ngClass]="{'chip-light-danger': state == 8,'chip-light-primary': state == 1, 'chip-light-warning': state == 3, 'chip-light-success': state == 2, 'chip-light-gray': state == 7, 'chip-light-canceled': state == 6, 'chip-light-info': state == 9 }"
      class="chip rounded fs-13 text-center {{classes}}">
      <span *ngIf="state == 1">{{'new' | translate}}</span>
      <span *ngIf="state == 2">{{'completed' | translate}}</span>
      <span *ngIf="state == 3">{{'in_progress' | translate}}</span>
      <span *ngIf="state == 6">{{'canceled' | translate}}</span>
      <span *ngIf="state == 7">{{'pending' | translate}}</span>
      <span *ngIf="state == 8">{{'rejected' | translate}}</span>  
      <span *ngIf="state == 9">{{'notified' | translate}}</span>
    </div>

  `,
  styles: []
})
export class TaskStatusComponent {
  @Input() state: any;
  @Input() classes = '';
}
