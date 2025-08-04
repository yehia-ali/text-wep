import {Component, Input, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ChatService} from "../../../../chat.service";
import {Chat} from "../../../../interfaces/chat";
import firebase from "firebase/compat";
import {Router} from "@angular/router";
import {environment} from "../../../../../../../../environments/environment";
import {TaskSentService} from "../../../../../../../core/services/task-sent.service";
import DocumentData = firebase.firestore.DocumentData;

@Component({
  selector: 'app-top-section',
  templateUrl: './top-section.component.html',
  styleUrls: ['./top-section.component.scss']
})
export class TopSectionComponent implements OnInit {
  @Input() taskDetails = false;
  apiUrl = environment.apiUrl;

  user: any;


  chatId: any = localStorage.getItem('chat-id')

  currentUserId = localStorage.getItem('id')

  selectedRoom!: Chat;
  taskId: any;
  loading: boolean;

  constructor(private firestore: AngularFirestore, private service: ChatService, private router: Router, private taskGroupDetailsSer: TaskSentService) {
  }

  ngOnInit(): void {
    this.service.roomId.subscribe(roomId => {
      this.firestore.collection("companies").doc(this.chatId).collection('rooms').doc(roomId).snapshotChanges().subscribe((res: DocumentData) => {
        this.selectedRoom = res['payload'].data();
        if (this.selectedRoom.subType == 'private') {
          let user = this.selectedRoom.members.filter(user => user.id != this.currentUserId)[0];
          this.service.getUserProfiles([user.id]).subscribe(res => {
            let userData = res[0]
            console.log(userData);

            this.user = {name: userData.name, avatar: userData.imageUrl , id: userData.id}
          })
        }
      })
    })
  }

  open = false;
  assignees = [];
  reporters = [];

  getTask() {
    this.loading = true
    this.service.getTask(this.selectedRoom.id).subscribe((res: any) => {
      this.loading = false
      this.taskId = {
        id:res.data.taskGroupForCreator,
        title:this.selectedRoom.name
      }
      if (res.data.taskForTheAssignee) {
        this.router.navigate(['/tasks/inbox/details/' + res.data.taskForTheAssignee])
      } else {
        this.open = false;
        setTimeout(() => {
          this.open = true;
        }, 0);
        // this.taskGroupDetailsSer.getAssignees(res.data.taskGroupForCreator).subscribe((res: any) => {
        //   this.assignees = res;
        // });
        this.taskGroupDetailsSer.getReporters(res.data.taskGroupForCreator).subscribe((res: any) => {
          this.reporters = res.data.items;
        });

      }
    })
  }
}

