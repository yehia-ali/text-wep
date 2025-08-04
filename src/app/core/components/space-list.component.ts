import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserImageComponent} from "./user-image.component";
import {SpacesService} from "../services/spaces.service";
import {BehaviorSubject} from "rxjs";
import {Space} from "../interfaces/space";
import {TranslateModule} from "@ngx-translate/core";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'space-list',
  standalone: true,
  imports: [CommonModule, UserImageComponent, TranslateModule],
  template: `
  <ng-container *ngFor="let space of spaces$ | async; let i = index">
    <div class="space pointer border-bottom flex aic jcsb gap-x-1 py-1 px-2" *ngIf="space.spaceId != '90817'" (click)="switchSpace(space)">
      <div class="flex aic gap-x-1">
        <user-image [img]="space.spaceLogo" [dim]="32"/>
        <p class="line-height">{{space.spaceName}}</p>
      </div>
      <div class="flex-center bg-light-primary-2 rounded-5 px-1 py-50 primary current" *ngIf="currentSpaceId == space.spaceId">
        {{'current' | translate}}
      </div>
      <!-- <div class="flex-center bg-light-success rounded-5 px-1 py-50 success" *ngIf="space.isActive && !(currentSpaceId == space.spaceId)">
        {{'active' | translate}}
      </div>
      <div class="flex-center bg-light-danger rounded-5 px-1 py-50 danger" *ngIf="!space.isActive && !(currentSpaceId == space.spaceId)">
        {{'inactive' | translate}}
      </div> -->
    </div>
  </ng-container>
  `,
  styles: [`
    .space {
      &:hover {
        background-color: #f5f5f5;
      }
    }
  `]
})
export class SpaceListComponent {
  service = inject(SpacesService);
  userSer = inject(UserService);
  spaces$: BehaviorSubject<Space[]> = this.service.spaces$;
  currentSpaceId = localStorage.getItem('space-id');
  router = inject(Router);

  switchSpace(space: Space) {
    this.service.switchSpace(space.spaceId).subscribe((_res: any) => {
      if (_res.success && _res.code !== 9954) {
        localStorage.setItem('space-id', space.spaceId);
        localStorage.setItem('base-url', space.baseUrl);
        localStorage.setItem('chat-id', space.chatId);
        //checking if the account has been activated or not
        this.userSer.getMyProfile(space.spaceId, space.baseUrl).subscribe((res: any) => {
          if (res.success) {
            window.location.href = '/';
          } else if (res.code == 401) {
            let token = localStorage.getItem('token') || '';
            let language = localStorage.getItem('language') || 'en';
            localStorage.clear();
            localStorage.setItem('token', token);
            localStorage.setItem('language', language);
            this.router.navigate(['/welcome'])
          }
        })
      }
    });
  }
}
