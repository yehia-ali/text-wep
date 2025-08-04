import {Component, inject, Input} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MagicScrollDirective} from "../directives/magic-scroll.directive";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {SectionTitleComponent} from "./section-title.component";
import {TranslateModule} from "@ngx-translate/core";
import {RolesService} from "../services/roles.service";

@Component({
  selector: 'sub-sidebar',
  standalone: true,
  imports: [CommonModule, MagicScrollDirective, NgOptimizedImage, RouterLinkActive, RouterLink, SectionTitleComponent, TranslateModule],
  template: `
    <div class="sub-sidebar h-100v bg-white border-right p-1" magicScroll>
      <p class="mt-1 primary fs-25 bold text-center">{{'_tasked' | translate}}<span style="color: #65C7C3">{{'_in' | translate}}</span></p>
      <div class="content">
        <section-title [text]="sectionTitle"/>
        <div class="items-list py-2 ml-50">
          <ng-container *ngFor="let item of list">
            <a class="item flex aic gap-x-1 img rounded-tl-5 rounded-bl-5" *ngIf="shouldDisplayLink(item)" [routerLink]="item.link" routerLinkActive="active primary-image-container">
              <img *ngIf="item.img" [ngSrc]="item.img" alt="Taskedin logo" width="16" height="16" class="convert-image-color">
              <i  *ngIf="item.icon" class="bx {{item.icon}}"></i>
              <p class="fs-14">{{ item.title | translate }}</p>
            </a>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sub-sidebar {
      width: 195px;
    }

    .item {
      &:not(:last-child) {
        margin-bottom: 20px;
      }

      &.active {
        p,i {
          color: var(--primary);
        }
      }
    }
  `]
})
export class SubSidebarComponent {
  @Input() list: any[] = [];
  @Input() sectionTitle: string = '';

  rolesSer = inject(RolesService);

  shouldDisplayLink(item: any): boolean {
    if (!this.rolesSer.rolesLoaded$.value) {
      return false; // If data is not loaded, do not display the link
    }

    const userRoles = this.rolesSer.getUserRoles();

    // Check if any inclusion role matches
    const includesRole = !item.roles || item.roles.length === 0 || item.roles.some((role: any) => userRoles.includes(role));

    // Check if any exclusion role matches
    const excludesRole = item.excludeRoles && item.excludeRoles.some((role: any) => userRoles.includes(role));

    // Display the link if it matches inclusion roles and does not match exclusion roles
    return includesRole && !excludesRole;
  }

}
