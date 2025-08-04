import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ChatService} from "../../../../../chat.service";
import {ChatUser} from "../../../../../interfaces/chat";

@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.scss']
})
export class GroupMembersComponent implements OnInit {
  chatId: any = localStorage.getItem('chat-id');
  users: ChatUser[] = []
  constructor(private firestore: AngularFirestore, private service: ChatService) { }

  ngOnInit(): void {
  }

  getMembers() {
    this.users = [];
    this.firestore.collection("companies").doc(this.chatId).collection('rooms').doc(this.service.roomIdValue).collection('members').snapshotChanges().subscribe(res => {
      res.map((msg: any) => {
        this.users.push(msg.payload.doc.data());
      });
      this.getUsers()
    })
  }

  open = false;
  getUsers() {
    this.open = false;
    setTimeout(() => {
      this.open = true;
    }, 0);
  }

}
