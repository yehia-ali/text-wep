import { Component, Input } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { ArabicDatePipe } from "../../pipes/arabic-date.pipe";
import { ArabicTimePipe } from "../../pipes/arabic-time.pipe";
import { UserService } from '../../services/user.service';
import { UserInfoComponent } from "../user-info/user-info.component";

@Component({
  selector: 'app-img-title',
  standalone: true,
  imports: [
    CommonModule,
    ArabicDatePipe,
    ArabicTimePipe,
    UserInfoComponent
],
  templateUrl: './img-title.component.html',
  styleUrls: [ `./img-title.component.scss`]
  })
  export class UserWithImageComponent {

  @Input() imgSrc: any;
  @Input() title: any;
  @Input() subTitle: any;
  @Input() imgSize: any = null;
  @Input() type: any = 'user';
  @Input() bigTitle: any = null;
  @Input() date: any = null;
  @Input() noImage = false;
  @Input() fontSize = 'fs-11 simibold';
  @Input() userId = null;
  @Input() imgBorder = '';
  noUser: any;
  imageUrl= environment.imageUrl;
  open = false;
  user: any;

  ngOnInit(): void {
    if(this.type =='user') {
      this.noUser = 'assets/images/no-user.jpg'
    }
  }

  constructor(private userSer:UserService){}
  showProfile() {
    if(this.userId){
      this.open = false;
      this.userSer.getUserProfile(this.userId).subscribe((res: any) => {
        this.user = res
        this.userSer.havePermissions(res.id).subscribe((res: any) => {
          let havePermissions = res.data.isHaveThePermission
          this.userSer.havePermissions$.next(havePermissions)
          this.open = true;
        })
      });
    }
  }
}
