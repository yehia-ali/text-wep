import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ArabicNumbersPipe} from "../pipes/arabic-numbers.pipe";
import {UserImageComponent} from "./user-image.component";

@Component({
  selector: 'task-vote-users',
  standalone: true,
  imports: [CommonModule, ArabicNumbersPipe, UserImageComponent],
  template: `
    <div class="flex aic users-container">
      <ng-container *ngFor="let image of images.slice(0, 3)">
        <div class="user-image rounded-50 border">
          <user-image [img]="image" [dim]="35"></user-image>
        </div>
      </ng-container>

      <ng-container *ngIf="images?.length! > 3">
        <div class="number-left flex-center rounded-50 border fs-13 pointer">
          +{{images.length - 3 | arabicNumbers}}
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .users-container {
      margin-inline-start: 1.5rem;
    }

    .user-image {
      margin-inline-start: -1.5rem;
      border-color: whitesmoke;

      &:hover {
        z-index: 5;
        cursor: pointer;
      }
    }

    .number-left {
      background: var(--primary);
      width: 3.5rem;
      height: 3.5rem;
      margin-inline-start: -1.5rem;
      color: #fff;
    }

  `]
})
export class TaskVoteUsersComponent {
  @Input() images: any = [];

}
