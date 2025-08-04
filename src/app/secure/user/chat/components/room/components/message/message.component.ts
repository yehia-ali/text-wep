import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Room} from "../../../../interfaces/room";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ChatService} from "../../../../chat.service";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationMessageComponent} from "../../../../../../../core/dialogs/confirmation-message.component";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnChanges, OnDestroy {
  @Input() message!: Room;
  currentUserId: any = localStorage.getItem('id');
  spaceId: any = localStorage.getItem('space-id')
  roomUsers!: any;

  constructor(private firestore: AngularFirestore, public service: ChatService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.message.date = new Date(this.message.timeStamp.seconds * 1000);
    let today = new Date().getDate() == this.message.date.getDate();
    let year = new Date().getFullYear() == this.message.date.getFullYear();
    let month = new Date().getMonth() == this.message.date.getMonth();
    this.message.isToday = today && year && month;
  }

  deleteMessage(message: Room) {
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      data: {
        message: 'delete_message',
        btn_name: 'confirm',
        classes: 'bg-primary white',
        messageId: message.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.firestore.collection("companies").doc(localStorage.getItem('chat-id') || '').collection('rooms').doc(this.service.roomIdValue).collection('messages').doc(message.id).update({
          isDeleted: true
        })
      }
    });
  }

  reply(message: any) {
    this.service.messageReply.next(message);
  }

  ngOnDestroy() {

  }

}
