import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {map, Observable} from "rxjs";
import {Chat} from "../../interfaces/chat";
import {ChatService} from "../../chat.service";

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.scss']
})
export class ChatsListComponent implements OnInit {
  chatId: any = localStorage.getItem('chat-id');
  userId: any = localStorage.getItem('id');
  chats$: Observable<Chat[]> = this.firestore.collection("companies").doc(this.chatId).collection('rooms', ref => ref.where("membersIds", "array-contains", this.userId).orderBy("lastMessage.timeStamp", 'desc')).snapshotChanges().pipe(map((snaps: any) => snaps.map((snap: any) => snap.payload.doc.data())));
  privateChat$: Observable<Chat[]> = this.getPrivateChat();
  groupChat$: Observable<Chat[]> = this.getGroupChat();
  groupTaskChat$: Observable<Chat[]> = this.getTaskChat();
  tabIndex = 0;
  query = ''
  roomId = '0';
  activeRoom = '0';

  constructor(private firestore: AngularFirestore, private service: ChatService) {
  }

  ngOnInit(): void {
    this.service.roomId.subscribe(res => this.roomId = res);
  }

  openRoom(chat: Chat) {
    this.activeRoom = chat.id
    if (chat.id != this.roomId) {
      this.service.roomId.next(chat.id);
      this.service.isNewRoom.next(true);
      this.service.getRoomChat(true)
      this.service.roomUsersIds.next(chat.membersIds)
    }
  }

  search(query: string) {
    this.query = query;
    if (this.tabIndex == 0) {
      this.groupTaskChat$ = this.getTaskChat(query);
    } else if (this.tabIndex == 1) {
      this.groupChat$ = this.getGroupChat(query);
    } else if (this.tabIndex == 2) {
      this.privateChat$ = this.getPrivateChat(query)
    }
  }

  selectedTabChanged($event: any) {
    this.search('')
    this.tabIndex = $event.index;
    this.query = ''
  }

  getTaskChat(query = '') {
    return this.chats$.pipe(map(chats => chats.filter(chat => chat.subType == 'task' && chat.type == 'group' && chat.name.toLowerCase().includes(query.toLowerCase()))))
  }

  getGroupChat(query = '') {
    return this.chats$.pipe(map(chats => chats.filter(chat => chat.subType == 'group' && chat.type == 'group' && chat.name.toLowerCase().includes(query.toLowerCase()))))
  }

  getPrivateChat(query = '') {
    return this.chats$.pipe(map(chats => {
      let memberIds: any = [];
      chats.map(chat => {
        if (chat.type == 'private' && chat.subType == 'private') {
          let joinedUser = chat.members.find(user => user.id != this.userId);
          memberIds.push(joinedUser?.id)
        }
      });
      if (memberIds.length > 0) {
        this.service.getUserProfiles(memberIds).subscribe(res => {
          let users = res;
          chats.map(chat => {
            if (chat.type == 'private' && chat.subType == 'private') {
              let joinedUser = chat.members.find(user => user.id != this.userId);
              let joinedUserData = users.find((user: any) => user.id == joinedUser?.id)
              chat.members.map(user => {
                if (user.id != this.userId) {
                  user.name = joinedUserData.name;
                  user.avatar = joinedUserData.imageUrl;
                }
              });
            }
          });
        });
      }
      return chats.filter(chat => chat.subType == 'private' && chat.type == 'private' &&
        (chat.members.filter(member => member.id != this.userId)[0].name.toLowerCase().includes(query.toLowerCase())))
    }));
  }

  trackBy(index: any, item: any) {
    return item.id;
  }

}
