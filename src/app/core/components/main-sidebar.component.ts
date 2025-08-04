import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MagicScrollDirective} from "../directives/magic-scroll.directive";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {MatTooltipModule} from "@angular/material/tooltip";
import {TranslateModule} from "@ngx-translate/core";
import {RolesService} from "../services/roles.service";

@Component({
  selector: 'main-sidebar',
  standalone: true,
  imports: [CommonModule, MagicScrollDirective, NgOptimizedImage, RouterLink, RouterLinkActive, MatTooltipModule, TranslateModule],
  template: `
    <div class="main-sidebar h-100v bg-white border-right py-1" magicScroll>
      <div class="img text-center logo pointer" routerLink="/home">
        <img ngSrc="assets/images/logo/logo.png" alt="Taskedin logo" width="27" height="24">
      </div>
      <div class="items-list mt-2 ml-50">
        <ng-container *ngFor="let item of list">
          <a class="item d-block img {{item.beta ? 'beta' : ''}}" [routerLink]="item.link" routerLinkActive="active primary-image-container" (click)="routeMe(item)" *ngIf="shouldDisplayLink(item)"
             [matTooltip]="item.tooltip | translate" matTooltipPosition="after" matTooltipClass="tooltip">
            <img *ngIf="item.img" [ngSrc]="item.img" alt="Taskedin logo" width="24" height="24" class="convert-image-color">
            <i *ngIf="item.icon" class="bx {{item.icon}} fs-24"></i>
          </a>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .main-sidebar {
      width: 48px;

      .logo {
        margin-top: 1.4rem;
      }

      .item {
        position:relative;
        padding: 5px 7px;
        border-end-start-radius: 1.2rem;
        border-start-start-radius: 1.2rem;
        .bx{
            color:#9c9c9c
          }
        &:not(:last-child) {
          margin-bottom: 5px;
        }

        &.active {
          background-color: rgba(#7b58ca, .15);
          .bx{
            color:#7b58ca
          }
        }
        &.beta::before{
          content: "";
          height: 10px;
          width: 10px;
          border-radius: 50%;
          background-color: #ea5455;
          position: absolute;
          margin-inline-start: -9px;
          top: -2px;
        }
      }
    }
  `]
})
export class MainSidebarComponent {
  @Input() list:any[] = [];
  router = inject(Router);
  rolesSer = inject(RolesService);

  shouldDisplayLink(item: any): boolean {
    // Check if super admin and space-id is not set
    const isSuperAdmin = !!localStorage.getItem('is-super-admin');
    const noSpaceId = !localStorage.getItem('space-id');

    // Handle scenarios based on super admin and space-id conditions:
    if (!this.rolesSer.rolesLoaded$.value && !isSuperAdmin) {
      return false; // Data not loaded and not super admin, hide link
    } else if (isSuperAdmin && noSpaceId && !item.roles?.includes('taskedin-super-admin')) {
      return item.excludeRoles?.length === 0; // Super admin with no space-id, show link only if no exclusion roles and not 'taskedin-super-admin'
    } else {
      const userRoles = this.rolesSer.getUserRoles();

      // Check if any inclusion role matches
      const includesRole = !item.roles || item.roles.length === 0 || item.roles.some((role: any) => userRoles?.includes(role));

      // Check if any exclusion role matches
      const excludesRole = item.excludeRoles && item.excludeRoles.some((role: any) => userRoles?.includes(role));

      // Display the link if it matches inclusion roles and does not match exclusion roles
      return includesRole && !excludesRole;
    }
  }

  routeMe(item: any) {
    let spaceId = localStorage.getItem('space-id');
    this.router.navigate([item.defaultRoute || item.link])
  }
}
