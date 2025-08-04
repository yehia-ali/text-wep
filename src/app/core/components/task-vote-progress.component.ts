import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArabicNumbersPipe} from "../pipes/arabic-numbers.pipe";

@Component({
  selector: 'task-vote-progress',
  standalone: true,
  imports: [CommonModule, ArabicNumbersPipe],
  template: `
    <div class="task-progress flex aic" [style.width]="width">
      <div class="bar rounded w-100 mr-1">
        <div class="progress" [ngClass]="{'bg-success': progress == 100, 'bg-warning': progress != 100}" [style.width]="progress + '%'"></div>
      </div>
      <span class="fs-14 {{color}}" [ngClass]="{'success': progress == 100 && !color, 'warning': progress != 100 && !color}">{{ progress | arabicNumbers}}%</span>
    </div>

  `,
  styles: [`
    .task-progress {
      .bar {
        position: relative;
        height: 4px;
        background-color: #E2E2E2;
        overflow: hidden;

        .progress {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
        }
      }
    }
  `]
})
export class TaskVoteProgressComponent {
  @Input() progress: any = 0;
  @Input() width = `10rem`;
  @Input() classes!: string;
  @Input() color!: string;


}
