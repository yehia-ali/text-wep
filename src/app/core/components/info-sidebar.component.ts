import {Component, ElementRef, inject, Input, OnChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MagicScrollDirective} from "../directives/magic-scroll.directive";

@Component({
  selector: 'info-sidebar',
  standalone: true,
  imports: [CommonModule, MagicScrollDirective, MagicScrollDirective],
  template: `
    <div class="info-sidebar bg-white h-100" [ngClass]="{'open': open}">
      <div class="info-sidebar-title flex jcfs aic px-2 py-3 bg-gray">
        <ng-content select="[header]"></ng-content>
      </div>
      <div class="info-sidebar-content" magicScroll="">
        <ng-content select="[content]"></ng-content>
      </div>
    </div>

    <div class="backdrop" (click)="open = false" *ngIf="open"></div>
  `,
  styles: [`
    .info-sidebar {
      position: fixed;
      top: 0;
      inset-inline-end: -100%;
      width: 40rem;
      z-index: 1001;
      transition: inset-inline-end .3s cubic-bezier(.25, .8, .25, 1);;

      &.open {
        inset-inline-end: 0;
      }

      .info-sidebar-title {
        padding: 2.5rem;
      }

    }

    .info-sidebar-content {
      height: calc(100vh - 9rem);
    }

    .backdrop {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 1000;
      background-color: rgba(0, 0, 0, 0.4);
      opacity: 1;
      transition: opacity 0.3s ease-in-out;
    }
  `]
})
export class InfoSidebarComponent implements OnChanges {
  @Input() open = false;
  elm = inject(ElementRef);

  ngOnChanges() {
    // to reset the height of the sidebar after opening it
    let title = this.elm.nativeElement.querySelector('.info-sidebar-title');
    let content = this.elm.nativeElement.querySelector('.info-sidebar-content');
    let wrapper = this.elm.nativeElement.querySelector('.mat-tab-body-content');
    if (wrapper) {
      wrapper.scrollTop = 0;
    } else {
      content.scrollTop = 0;
    }
    content.style.height = 'calc(100% - ' + (title.offsetHeight + 20) + 'px)';
  }

}
