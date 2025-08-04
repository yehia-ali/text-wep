import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Chat} from "../../../../interfaces/chat";
import {environment} from "../../../../../../../../environments/environment";
import {ChatDate} from "../../../../../../../core/functions/chat-date";


@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.scss']
})
export class GroupChatComponent implements OnInit, OnChanges {
  @Input() chat!: Chat;
  apiUrl = environment.apiUrl;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    ChatDate(this.chat)
  }

}
