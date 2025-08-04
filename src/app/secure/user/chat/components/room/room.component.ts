import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ChatService} from "../../chat.service";
import {Room} from "../../interfaces/room";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {
  @Input() taskDetails = false;
  @Input() header = true;
  @Input() chatBtns = true;
  room!: Room[];
  timeout: any;
  sub1!: Subscription;
  sub2!: Subscription;
  newRoom = false;
  hasReply = false;

  constructor(private service: ChatService) {
  }

  ngOnInit(): void {
    this.sub1 = this.service.messages$.subscribe(res => {
      this.room = res;
    });
    this.sub2 = this.service.messageReply.subscribe((res) => {
      this.hasReply = !!res;
    });

    this.service.newRoomCreated.subscribe(res => this.newRoom = res);

    let room = document.getElementById("room")!;
    room.addEventListener("scroll", () => {
      clearTimeout(this.timeout);
      if ((Math.abs(room.scrollTop) + room.clientHeight + 100 >= room.scrollHeight) && this.service.roomIdValue != '0') {
        this.timeout = setTimeout(() => {
          this.service.getRoomChat(false);
        }, 300)
      }
    });
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

  trackBy(index: any, item: any) {
    return item.id;
  }
}
