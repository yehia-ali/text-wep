import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {User} from "../../interfaces/user";
import {environment} from "../../../../environments/environment";
import {UserService} from "../../services/user.service";
import {TaskInboxService} from "../../services/task-inbox.service";
import {TaskSentService} from "../../services/task-sent.service";
import {Router} from "@angular/router";
import {InfoSidebarComponent} from "../info-sidebar.component";
import {NgxStarRatingModule} from "ngx-star-rating";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'user-info',
  standalone: true,
  imports: [CommonModule, TranslateModule, InfoSidebarComponent, NgxStarRatingModule, FormsModule],
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent {
  @Input() open: any;
  @Input() user!: User;
  havePermissions = false;
  apiUrl = environment.apiUrl;
  lang = localStorage.getItem('language') || 'en'

  constructor(private service: UserService, private inboxSer: TaskInboxService, private sentSer: TaskSentService, private router: Router) {
  }

  ngOnInit(): void {
    this.service.havePermissions$.subscribe(res => this.havePermissions = res)
  }

  getInbox() {
    this.inboxSer.userInbox.next(this.user.id);
    this.inboxSer.userName.next(this.user.name)
    this.inboxSer.resetFilter();
    this.sentSer.hasChanged.next(true)
    this.router.navigate(['/tasks/inbox']);
  }

  getSent() {
    this.sentSer.userSent.next(this.user.id);
    this.sentSer.userName.next(this.user.name)
    this.sentSer.resetFilter();
    this.sentSer.hasChanged.next(true)
    this.router.navigate(['/tasks/sent']);
  }

}
