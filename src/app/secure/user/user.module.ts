import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import {UserComponent} from './user.component';
import {MainSidebarComponent} from "../../core/components/main-sidebar.component";
import {UserNavbarComponent} from "../../core/components/user-navbar/user-navbar.component";


@NgModule({
    declarations: [
        UserComponent,
    ],
    exports: [
        UserComponent
    ],
    imports: [
    CommonModule,
    UserRoutingModule,
    MainSidebarComponent,
    UserNavbarComponent,
]
})
export class UserModule {
}
