import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserImageComponent} from "./user-image.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'hierarchy-card',
  standalone: true,
  imports: [CommonModule, UserImageComponent, TranslateModule],
  template: `
    <div class="team-card p-1 rounded bg-gray flex aic gap-x-1">
      <user-image [img]="node.manager.imageUrl" [id]="node.manager.id"></user-image>
      <div class="info">
        <p class="primary">{{node.manager.name}}</p>
        <div class="fs-13 muted flex aic" [ngClass]="{'mt-25': node.manager.jobTitle || node.userCount}">
          <p class="mr-1" *ngIf="node.manager.jobTitle">{{node.manager.jobTitle}}</p>
          <p *ngIf="node.userCount > 0">( {{node.userCount}} {{'member' | translate}} )</p>
        </div>
      </div>
    </div>

  `,
  styles: [`
    .team-card {
      width: 40rem;
    }
  `]
})
export class HierarchyCardComponent {
  @Input() node: any;

}
