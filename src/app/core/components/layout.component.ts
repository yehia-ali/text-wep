import {Component, inject, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {LayoutService} from "../services/layout.service";

@Component({
  selector: 'layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="{{scroll ? 'scroll' : ''}} layout rounded bg-white border" [ngStyle]="{'max-width': service.withSubMenu.value ? '100vw' : 'calc(100vw - 92px)'}">
      <ng-content></ng-content>
    </div>

  `,
  styles: [`
    .layout {
      overflow: hidden;
      height: calc(100vh - 11rem);
      box-shadow: 0 1px 38px 0 rgb(0 0 0 / 10%), 0 2px 4px -1px rgb(0 0 0 / 6%);
    }
    .scroll{
      overflow-y:auto !important;
    }

  `]
})
export class LayoutComponent {
  @Input() scroll  = false
  service = inject(LayoutService);
}
