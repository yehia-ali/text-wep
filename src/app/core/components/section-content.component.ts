import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {UserNavbarComponent} from "./user-navbar/user-navbar.component";

@Component({
  selector: 'section-content',
  standalone: true,
  imports: [CommonModule, RouterOutlet, UserNavbarComponent],
  template: `
      <user-navbar/>
      <div class="content {{padding}}">
          <router-outlet/>
      </div>
  `,
  styles: [`
    .content {
      //max-width: 80vw;
      //max-width: 100%;
    }
  `]
})
export class SectionContentComponent {
  @Input() padding = 'p-2'
}
