import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {MagicScrollDirective} from "../directives/magic-scroll.directive";
import {ArabicNumbersPipe} from "../pipes/arabic-numbers.pipe";
import {FormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {LayoutService} from "../services/layout.service";

@Component({
  selector: 'layout-with-filters',
  standalone: true,
  imports: [CommonModule, TranslateModule, MagicScrollDirective, ArabicNumbersPipe, FormsModule, NgxPaginationModule],
  template: `
    <div class="layout-with-filters w-100 rounded bg-white border"
         [ngStyle]="{'height': hasTitle ? 'calc(100vh - 14.5rem)' : hasCard ? 'calc(100vh - 27.7rem)' : 'calc(100vh - 11rem)', 'max-width': service.withSubMenu.value ? 'calc(100vw - 277px)' : 'calc(100vw - 92px)'}">
      <div class="filters border-bottom px-1 pb-1 pt-25">
        <ng-content select="[filters]"></ng-content>
      </div>
      <div class="content relative" magicScroll="">
        <ng-content select="[content]"></ng-content>
      </div>
      <div class="pagination-content flex aic jcsr py-1 bg-white border-top">
        <div class="flex aic">
          <p>{{ 'pagination_per_page' | translate }} </p>
          <p class="ml-75 primary" *ngIf="!admin">{{ meta?.pageSize ? (meta?.pageSize | arabicNumbers) : ('unlimited' | translate) }}</p>
          <input type="number" class="input ml-75 limit text-center" min="1" [(ngModel)]="limit" *ngIf="admin" (ngModelChange)="changeLimit()">
          <p class="ml-50 primary" *ngIf="meta?.pageSize">{{ 'record' | translate }}</p>
        </div>
        <pagination-controls (pageChange)="pageChanged($event)" [maxSize]="7" [directionLinks]="true" [previousLabel]="'previous' | translate" [nextLabel]="'next' | translate"
                             *ngIf="meta?.totalItems > 15">
        </pagination-controls>
        <p>{{ 'pagination_total_records' | translate }} <span
          class="primary">{{ meta?.totalItems | arabicNumbers }} {{ 'record' | translate }}</span>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .layout-with-filters {
      overflow: hidden;
      box-shadow: 0 1px 38px 0 rgb(0 0 0 / 10%), 0 2px 4px -1px rgb(0 0 0 / 6%);
      .filters {
        z-index: 999;
      }

      .content {
        height: calc(100% - (58px + 79px));
      }

      .pagination-content {
        height: 58px;
      }
    }

    .limit {
      width: 5rem;
      padding: 1.1rem .5rem;
    }
  `]
})
export class LayoutWithFiltersComponent {
  @Output() pageChange = new EventEmitter<any>();
  @Output() limitChanged = new EventEmitter<any>();
  @Input() meta: any;
  @Input() hasTitle = false;
  @Input() admin = false;
  @Input() limit = 15;
  @Input() hasCard = false;
  @Input() extraHeight = 0;

  service = inject(LayoutService);
  timeout: any;

  constructor() {
  }

  changeLimit() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (this.limit < 1) {
        this.limit = 15;
      }
      this.limitChanged.emit(this.limit);
    }, 500)
  }

  pageChanged($event: any) {
    this.pageChange.emit($event)
  }
}
