import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {BehaviorSubject, map, Subscription} from "rxjs";
import {Room} from "./interfaces/room";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  chatId: any = localStorage.getItem('chat-id');
  userId: any = localStorage.getItem('id');
  messages$ = new BehaviorSubject<Room[]>([])
  messagesValue: Room[] = [];
  roomId = new BehaviorSubject<string>('0');
  roomIdValue = '0';
  limit = new BehaviorSubject(0)
  limitValue = 0;
  sub!: Subscription;
  isNewRoom = new BehaviorSubject(false)
  isNewRoomValue!: any;
  newRoomCreated = new BehaviorSubject(false);
  messageReply = new BehaviorSubject(null);
  roomUsersIds = new BehaviorSubject<any>([]);

  constructor(private firestore: AngularFirestore, private http: HttpClient) {
    this.roomId.subscribe(roomId => {
      this.roomIdValue = roomId;
    });
    this.messages$.subscribe(messages => this.messagesValue = messages);
    this.limit.subscribe(limit => this.limitValue = limit);
    this.isNewRoom.subscribe(isNewRoom => this.isNewRoomValue = isNewRoom);
  }

  getRoomChat(newRoom = false) {
    if (this.messagesValue.length > 0) {
      this.sub.unsubscribe()
    }
    !newRoom ? this.limit.next(this.limitValue + 20) : this.limit.next(20);
    this.sub = this.firestore.collection("companies").doc(this.chatId).collection('rooms').doc(this.roomIdValue)
      .collection('messages', (ref: any) => ref.orderBy('timeStamp', 'desc').limit(this.limitValue)).snapshotChanges()
      .subscribe((data: any) => {
        if (this.roomUsersIds.value.length > 0) {
          this.getUserProfiles(this.roomUsersIds.value).subscribe((res: any) => {
            let messages: any = []
            data.map((msg: any) => messages.push(msg.payload.doc.data()));
            messages.map((msg: any) => {
              msg.senderAvatar = res.find((user: any) => user.id == msg.senderId)?.imageUrl;
              msg.senderName = res.find((user: any) => user.id == msg.senderId)?.name;
            })
            this.messages$.next(messages);
            if (this.isNewRoomValue) {
              let room = document.getElementById("room");
              room?.scrollBy(0, room.scrollHeight)
            }
            this.isNewRoom.next(false)
          })
        } else {
          this.firestore.collection("companies").doc(this.chatId).collection('rooms').doc(this.roomIdValue).collection('members').snapshotChanges().subscribe((users: any) => {
            let roomUsers: any = [];
            users.map((msg: any) => roomUsers.push(msg.payload.doc.data().id));
            this.getUserProfiles(roomUsers).subscribe((res: any) => {
              let messages: any = []
              data.map((msg: any) => messages.push(msg.payload.doc.data()));
              messages.map((msg: any) => {
                msg.senderAvatar = res.find((user: any) => user.id == msg.senderId)?.imageUrl;
                msg.senderName = res.find((user: any) => user.id == msg.senderId)?.name;
              })
              this.messages$.next(messages);
              if (this.isNewRoomValue) {
                let room = document.getElementById("room");
                room?.scrollBy(0, room.scrollHeight)
              }
              this.isNewRoom.next(false)
            })
          })
        }

      });
  }

  uploadAttachments(file: any) {
    return this.http.post(`${environment.apiUrl}api/Chat/UploadAttachment`, file);
  }

  getTask(chatId: string) {
    return this.http.get(`${environment.apiUrl}api/Chat/getTaskOrTaskGroupByChatId?chatId=${chatId}`)
  }

  refreshTaskUser(id: number) {
    return this.http.post(`${environment.apiUrl}api/Chat/RefreshTaskuser`, {id})
  }

  getUserProfiles(data: any) {
    let url = new URL(`${environment.apiUrl}api/UserProfile/GetUserProfileMainData`);
    data.map((user: any) => {
      url.searchParams.append('ids', user.id || user)
    })
    return this.http.get(`${url}`).pipe(map((res: any) => {
      return res.data
    }))
  }
}
