import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Chat} from "../../../../interfaces/chat";
import {ChatDate} from "../../../../../../../core/functions/chat-date";

@Component({
  selector: 'app-group-task-chat',
  templateUrl: './group-task-chat.component.html',
  styleUrls: ['./group-task-chat.component.scss']
})
export class GroupTaskChatComponent implements OnInit, OnChanges {
  @Input() chat!: Chat;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    ChatDate(this.chat)
  }

}
