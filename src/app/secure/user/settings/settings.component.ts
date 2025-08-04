import {Component} from '@angular/core';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  sidebarList = [
    {img: 'assets/images/sub-sidebar/profile.svg', link: 'profile', title: 'profile'},
    {img: 'assets/images/sub-sidebar/lock.svg', link: 'change-password', title: 'change_password'},
    {img: 'assets/images/sub-sidebar/rejected.svg', link: 'delete-account', title: 'delete_account'},
    {img: 'assets/images/main-sidebar/email.svg', link: 'email', title: 'email'},
    // {img: 'assets/images/main-sidebar/email.svg', link: '/email', tooltip: 'email'},

  ];
}
