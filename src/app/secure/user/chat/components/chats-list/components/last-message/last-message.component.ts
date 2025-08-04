import {Component, Input, OnInit} from '@angular/core';
import {Chat} from "../../../../interfaces/chat";

@Component({
  selector: 'app-last-message',
  templateUrl: './last-message.component.html',
  styleUrls: ['./last-message.component.scss']
})
export class LastMessageComponent implements OnInit {
  @Input() chat!: Chat;
  @Input() notSeen = false;
  currentUserId = localStorage.getItem('id');
  constructor() { }

  ngOnInit(): void {
  }

}
