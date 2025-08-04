import {Component, inject, OnInit} from '@angular/core';
import {RolesService} from "../../../core/services/roles.service";

@Component({
  selector: 'company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  rolesSer = inject(RolesService);
  sidebarList = [
    {img: 'assets/images/sub-sidebar/company-profile.svg', link: 'profile', title: 'profile' , },
    {img: 'assets/images/sub-sidebar/departments.svg', link: 'departments', title: 'departments'},
    // {img: 'assets/images/sub-sidebar/hierarchy.svg', link: 'hierarchy', title: 'hierarchy'},
    {img: 'assets/images/main-sidebar/users.svg', link: 'all-users', title: 'all_users'},
    {img: 'assets/images/sub-sidebar/hierarchy.svg', link: 'user-hierarchy', title: 'hierarchy'},
  ];

  ngOnInit() {
    this.rolesSer.isManager.subscribe(res => {
      if (res) {
        this.sidebarList.push({img: 'assets/images/sub-sidebar/requests.svg', link: 'requests', title: 'requests'})
      }
    })

    // this.rolesSer.canAccessAdmin.subscribe(res => {
    //   if (res) {
    //     this.sidebarList.push(
    //       {img: 'assets/images/sub-sidebar/configuration.svg', link: 'leaves-settings', title: 'leaves_settings'},
    //       {img: 'assets/images/sub-sidebar/configuration.svg', link: 'space-configuration', title: 'configuration'},
    //     )
    //   }
    // })
  }
}
