import {Component, inject, Input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {environment} from 'src/environments/environment';
import {UserInfoComponent} from "./user-info/user-info.component";
import {UserService} from "../services/user.service";
import {User} from "../interfaces/user";

@Component({
  selector: 'user-image',
  standalone: true,
  imports: [CommonModule, UserInfoComponent],
  template: `
      <div class="img" (click)="id && userInfo()" [ngClass]="{'pointer': id}">
          <img src="assets/images/no-user.jpg" *ngIf="!img && type == 'user'" alt="" [width]="dim" [height]="dim" [ngClass]="{'border border-3 border-dark': border, 'rounded-50': rounded}">
          <img src="assets/images/icons/certificate.svg" *ngIf="!img && type == 'certificate'" alt="" [width]="dim" [height]="dim"
               [ngClass]="{'border border-3 border-dark': border, 'rounded-50': rounded}">
          <img src="assets/images/icons/building.svg" *ngIf="!img && type == 'work'" alt="" [width]="dim" [height]="dim" [ngClass]="{'border border-3 border-dark': border, 'rounded-50': rounded}">
          <img [src]="imageUrl + img" *ngIf="img && withBaseUrl" alt="" [width]="dim" [height]="dim" [ngClass]="{'rounded-50': rounded}">
          <img [src]="img" *ngIf="img && !withBaseUrl" alt="" [width]="dim" [height]="dim" [ngClass]="{'rounded-50': rounded, 'border border-3 border-dark': border}">
      </div>

      <user-info [open]="open" [user]="user" *ngIf="id"/>
  `,
  styles: [`
    img {
      object-fit: cover;
    }
  `]
})
export class UserImageComponent {
  @Input() dim = 40;
  @Input() img = '';
  @Input() border = false;
  @Input() rounded = true;
  @Input() withBaseUrl = true;
  @Input() type = 'user';
  @Input() imageUrl = environment.imageUrl;
  @Input() id!: any;
  open = false;
  userSer = inject(UserService)
  user!: User;

  userInfo() {
    this.open = false;
    this.userSer.getUserProfile(this.id).subscribe((res: any) => {
      this.user = res;
      this.userSer.havePermissions(res.id).subscribe((res: any) => {
        let havePermissions = res.data.isHaveThePermission
        this.userSer.havePermissions$.next(havePermissions)
        this.open = true;
      })
    });
  }
}
