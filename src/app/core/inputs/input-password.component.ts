import {Component, EventEmitter, Output} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'input-password',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="password relative">
      <ng-content></ng-content>
      <div class="icon border-left h-100 flex-center pointer" *ngIf="type == 'password'" (click)="changeType('text')">
        <i class='bx bx-hide fs-18'></i>
      </div>
      <div class="icon border-left h-100 flex-center pointer" *ngIf="type == 'text'" (click)="changeType('password')">
        <i class='bx bx-show fs-18'></i>
      </div>
    </div>

  `,
  styles: [`
    .icon {
      position: absolute;
      inset-inline-end: 0;
      top: 50%;
      transform: translateY(-50%);
      padding-inline: 15px;
    }
  `]
})
export class InputPasswordComponent {
  type = 'password';
  @Output() getType = new EventEmitter();

  changeType(type: string) {
    this.type = type;
    this.getType.emit(type)
  }
}
