import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ChatService} from "../../chat.service";
import {take} from "rxjs";
import {User} from "../../../../../core/interfaces/user";
import {UserService} from "../../../../../core/services/user.service";
import {SpacesService} from "../../../../../core/services/spaces.service";
import {SelectUserComponent} from "../../../../../core/components/select-user.component";
import {CreateGroupChatComponent} from "../../../../../core/components/create-group-chat/create-group-chat.component";

@Component({
  selector: 'app-create-chat',
  templateUrl: './create-chat.component.html',
  styleUrls: ['./create-chat.component.scss']
})
export class CreateChatComponent implements OnInit {
  selectedUser: User[] = [];
  privateChatUser!: User;
  currentUser!: User;
  currentUserId = localStorage.getItem('id');
  spaceId: any = localStorage.getItem('space-id');
  chatId: any = localStorage.getItem('chat-id');
  companyName!: string;

  constructor(private firestore: AngularFirestore, private dialog: MatDialog, private userSer: UserService, private service: ChatService, private spacesSer: SpacesService) {
  }

  ngOnInit(): void {
    this.userSer.user$.subscribe(res => this.currentUser = res);
    this.spacesSer.currentSpace.subscribe((res: any) => this.companyName = res.spaceName);
  }

  createGroupChat() {
    let ref = this.dialog.open(CreateGroupChatComponent, {
      panelClass: 'create-group-chat-dialog'
    });
  }


  // privateChat() {
  //   let dialogRef = this.dialog.open(SelectUserComponent, {
  //     panelClass: 'select-users-dialog',
  //     data: {
  //       chat: true,
  //       multi: false
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe((res) => {
  //     if (res?.changed) {
  //       this.privateChatUser = res.users[0];
  //       if (this.privateChatUser) {
  //         this.createPrivateChat()
  //       }
  //     }
  //   })
  // }

  createPrivateChat(users: any) {
    this.privateChatUser = users[0];
    let id: any;
    if (this.currentUserId) {
      id = +this.currentUserId > this.privateChatUser?.id ? `${this.currentUserId}_${this.privateChatUser?.id}` : `${this.privateChatUser?.id}_${this.currentUserId}`
    }
    this.firestore.collection("companies").doc(this.chatId).collection('rooms').doc(id).snapshotChanges().pipe(take(1)).subscribe(res => {
      // if there is an existing room
      if (!!res.payload.data()) {
        this.service.roomId.next(id);
        this.service.roomUsersIds.next([this.privateChatUser?.id, this.currentUserId]);
        this.service.newRoomCreated.next(true);
        this.service.getRoomChat(true)
      } else {
        let members = [
          {
            avatar: this.privateChatUser?.imageUrl,
            company: this.companyName,
            companyId: JSON.stringify(this.privateChatUser?.spaceId),
            department: this.privateChatUser?.departmentName,
            departmentId: JSON.stringify(this.privateChatUser?.departmentId),
            id: JSON.stringify(this.privateChatUser?.id),
            name: this.privateChatUser?.name,
          },
          {
            avatar: this.currentUser.imageUrl,
            company: this.companyName,
            companyId: JSON.stringify(this.currentUser.spaceId),
            department: this.currentUser.departmentName,
            departmentId: JSON.stringify(this.currentUser.departmentId),
            id: JSON.stringify(this.currentUser.id),
            name: this.currentUser.name,
          },
        ]
        const data = {
          createdAt: new Date(),
          id,
          members,
          membersIds: [JSON.stringify(this.privateChatUser?.id), this.currentUserId],
          subType: 'private',
          type: 'private',
        }
        this.firestore.collection("companies").doc(this.chatId).collection('rooms').doc(id).set(data).then(() => {
          this.service.roomId.next(id);
          this.service.roomUsersIds.next([this.privateChatUser?.id, this.currentUserId]);
          this.service.newRoomCreated.next(true);
          this.service.messages$.next([]);
          this.service.getRoomChat(true)
        })
      }
    })
  }
}
