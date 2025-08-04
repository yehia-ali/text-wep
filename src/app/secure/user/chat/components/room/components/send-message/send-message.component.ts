import {Component, Input, OnInit, ViewChild, ElementRef} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ChatService} from "../../../../chat.service";
import {UserService} from "../../../../../../../core/services/user.service";
import {environment} from "../../../../../../../../environments/environment";
import {User} from "../../../../../../../core/interfaces/user";

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit {
  @Input() chatBtns = true;
  @ViewChild('fileInput') fileInput!: ElementRef;
  message = '';
  dir = document.dir;
  currentUser!: User;
  chatId: any = localStorage.getItem('chat-id');
  roomIdValue!: any;
  isRecording = false;
  reply: any;

  constructor(private firestore: AngularFirestore, private userSer: UserService, private service: ChatService) {
  }

  ngOnInit(): void {
    this.userSer.user$.subscribe((res: any) => this.currentUser = res);
    this.service.roomId.subscribe(res => {
      this.roomIdValue = res;
      this.message = '';
      this.service.messageReply.next(null);
    });
    this.service.messageReply.subscribe(res => {
      if (res) {
        this.reply = res;
        delete this.reply.date;
        delete this.reply.isToday;
        document.getElementById('send-message')?.focus()
      } else {
        this.reply = null
      }
    });
  }

  sendMessage() {
    if (this.message) {
      let messageRef = this.firestore.collection("companies").doc(this.chatId).collection('rooms').doc(this.roomIdValue).collection('messages').doc().ref
      const data = {
        id: messageRef.id,
        text: this.message,
        senderId: JSON.stringify(this.currentUser.id),
        senderName: this.currentUser.name,
        senderAvatar: this.currentUser.imageUrl ? environment.apiUrl + this.currentUser.imageUrl : null,
        timeStamp: new Date(),
        isDeleted: false,
        isForward: false,
        messageType: 'text',
        messageStatus: "pending",
        isReply: !!this.reply,
        ...(!!this.reply && {message: this.reply})
      }
      messageRef.set(data).then();
      this.message = '';
      if (!!this.reply) {
        this.service.messageReply.next(null)
      }
    }
  }

  uploadFiles(event: any) {
    let files: any = event.target.files;
    for (let i = 0; i < files.length; i++) {
      let file: File = files[i];
      let formData = new FormData();
      formData.append('uploadedFiles', file)
      let fileNameWithExtension = file.name.split('.');
      let fileName = fileNameWithExtension[0];
      let messageRef = this.firestore.collection("companies").doc(this.chatId).collection('rooms').doc(this.roomIdValue).collection('messages').doc().ref
      this.service.uploadAttachments(formData).subscribe((res: any) => {
        if (res.success) {
          const fixedData = {
            id: messageRef.id,
            url: res.data.filePath,
            size: file.size,
            text: this.message,
            senderId: JSON.stringify(this.currentUser.id),
            senderName: this.currentUser.name,
            senderAvatar: environment.apiUrl + this.currentUser.imageUrl,
            timeStamp: new Date(),
            isDeleted: false,
            isForward: false,
            messageStatus: "pending",
            isReply: false,
            displayName: fileName,
          }
          let messageType;
          if (file.type.includes('image')) {
            messageType = 'image';
          } else if (file.type.includes('video')) {
            messageType = 'video'
          } else if (file.type.includes('audio')) {
            messageType = 'audio'
          } else {
            messageType = 'document'
          }
          const data = {
            ...fixedData,
            messageType
          }
          messageRef.set(data).then(() => {
          this.fileInput.nativeElement.value = '';
          })
        }
      })
    }
    this.message = '';
  }

  record($event: any) {
    let formData = new FormData();
    formData.append('uploadedFiles', $event)
    let messageRef = this.firestore.collection("companies").doc(this.chatId).collection('rooms').doc(this.roomIdValue).collection('messages').doc().ref
    this.service.uploadAttachments(formData).subscribe((res: any) => {
      if (res.success) {
        const data = {
          id: messageRef.id,
          url: res.data.filePath,
          size: $event.size,
          text: this.message,
          senderId: JSON.stringify(this.currentUser.id),
          senderName: this.currentUser.name,
          senderAvatar: environment.apiUrl + this.currentUser.imageUrl,
          timeStamp: new Date(),
          isDeleted: false,
          isForward: false,
          messageStatus: "pending",
          messageType: 'record',
          displayName: 'record',
          isReply: !!this.reply,
          ...(!!this.reply && {message: this.reply})
        }
        messageRef.set(data).then()
        if (!!this.reply) {
          this.service.messageReply.next(null)
        }
      }
    })
  }

  clearReply() {
    this.service.messageReply.next(null);
  }

}
