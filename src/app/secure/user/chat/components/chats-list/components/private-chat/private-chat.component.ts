import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Chat, ChatUser} from "../../../../interfaces/chat";
import {ChatDate} from "../../../../../../../core/functions/chat-date";


@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  styleUrls: ['./private-chat.component.scss']
})
export class PrivateChatComponent implements OnInit, OnChanges {
  @Input() chat!: Chat;
  @Input() notSeen = false;
  user!: ChatUser;
  currentUserId = localStorage.getItem('id');

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.user = this.chat.members.filter(user => user.id != this.currentUserId)[0];
    ChatDate(this.chat)
  }

}
