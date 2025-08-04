import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { ChatsListComponent } from './components/chats-list/chats-list.component';
import { GroupTaskChatComponent } from './components/chats-list/components/group-task-chat/group-task-chat.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {TranslateModule} from "@ngx-translate/core";
import { GroupChatComponent } from './components/chats-list/components/group-chat/group-chat.component';
import { PrivateChatComponent } from './components/chats-list/components/private-chat/private-chat.component';
import { LastMessageComponent } from './components/chats-list/components/last-message/last-message.component';
import {MatTabsModule} from "@angular/material/tabs";
import { RoomComponent } from './components/room/room.component';
import { MessageComponent } from './components/room/components/message/message.component';
import { SendMessageComponent } from './components/room/components/send-message/send-message.component';
import {FormsModule} from "@angular/forms";
import { TextComponent } from './components/room/components/message/components/text/text.component';
import { ImageComponent } from './components/room/components/message/components/image/image.component';
import { VideoComponent } from './components/room/components/message/components/video/video.component';
import { AudioComponent } from './components/room/components/message/components/audio/audio.component';
import { FilesComponent } from './components/room/components/message/components/files/files.component';
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import { TopSectionComponent } from './components/room/components/top-section/top-section.component';
import { GroupMembersComponent } from './components/room/components/top-section/group-members/group-members.component';
import { CreateChatComponent } from './components/create-chat/create-chat.component';
import {LayoutWithSidebarModule} from "../../../core/components/layout-with-sidebar/layout-with-sidebar.module";
import {UserImageComponent} from "../../../core/components/user-image.component";
import {SearchComponent} from "../../../core/filters/search.component";
import {MagicScrollDirective} from "../../../core/directives/magic-scroll.directive";
import {NotFoundComponent} from "../../../core/components/not-found.component";
import {ArabicDatePipe} from "../../../core/pipes/arabic-date.pipe";
import {ArabicTimePipe} from "../../../core/pipes/arabic-time.pipe";
import {CreateTaskComponent} from "../../../core/components/create-task/create-task.component";
import {InfoSidebarComponent} from "../../../core/components/info-sidebar.component";
import {TaskGroupDetailsComponent} from "../../../core/components/task-group-details.component";
import {LogoComponent} from "../../../core/components/logo.component";
import {RecordComponent} from "../../../core/components/record/record.component";
import {UserNavbarComponent} from "../../../core/components/user-navbar/user-navbar.component";
import {SelectUserComponent} from "../../../core/components/select-user.component";
import { LoadingComponent } from "../../../core/components/loading.component";
import { UserWithImageComponent } from "../../../core/components/user-with-image/user-with-image.component";


@NgModule({
    declarations: [
        ChatComponent,
        ChatsListComponent,
        GroupTaskChatComponent,
        GroupChatComponent,
        PrivateChatComponent,
        LastMessageComponent,
        RoomComponent,
        MessageComponent,
        SendMessageComponent,
        TextComponent,
        ImageComponent,
        VideoComponent,
        AudioComponent,
        FilesComponent,
        TopSectionComponent,
        GroupMembersComponent,
        CreateChatComponent
    ],
    exports: [
        ChatComponent,
        RoomComponent
    ],
    imports: [
    CommonModule,
    ChatRoutingModule,
    LayoutWithSidebarModule,
    UserImageComponent,
    SearchComponent,
    MagicScrollDirective,
    MatTooltipModule,
    TranslateModule,
    MatTabsModule,
    NotFoundComponent,
    FormsModule,
    ArabicDatePipe,
    ArabicTimePipe,
    MatMenuModule,
    MatButtonModule,
    CreateTaskComponent,
    InfoSidebarComponent,
    TaskGroupDetailsComponent,
    LayoutWithSidebarModule,
    LogoComponent,
    RecordComponent,
    UserNavbarComponent,
    SelectUserComponent,
    LoadingComponent,
    UserWithImageComponent
]
})
export class ChatModule { }
