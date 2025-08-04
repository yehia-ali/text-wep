import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CreateGroupChatService} from "./create-group-chat.service";
import {MatDialog} from '@angular/material/dialog';
import {User} from "../../interfaces/user";
import {UserService} from "../../services/user.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ChatService} from "../../../secure/user/chat/chat.service";
import {SpacesService} from "../../services/spaces.service";

@Component({
  selector: 'app-create-group-chat',
  templateUrl: './create-group-chat.component.html',
  styleUrls: ['./create-group-chat.component.scss']
})
export class CreateGroupChatComponent implements OnInit {
  currentUser!: User;
  spaceId: any = localStorage.getItem('space-id');
  chatId: any = localStorage.getItem('chat-id');
  loading = false;
  form: FormGroup;
  selectedUsers!: any;
  usersToAdd: any = [];
  imageToUpload!: any;
  filePath!: any;
  companyName!: string;

  constructor(private firestore: AngularFirestore, private service: CreateGroupChatService, private fb: FormBuilder, private dialog: MatDialog, private chatSer: ChatService, private userSer: UserService, private spacesSer: SpacesService) {
    this.form = this.fb.group({
      name: ["", Validators.required]
    })
  }

  ngOnInit(): void {
    this.userSer.user$.subscribe(res => this.currentUser = res);
    this.spacesSer.currentSpace.subscribe((res: any) => {
      this.companyName = res.spaceName
    });
  }

  createGroupChat() {
    this.loading = true;
    let membersIds = this.usersToAdd.map((user: any) => JSON.stringify(user.id));
    let members = this.usersToAdd.map((user: User) => {
      return {
        avatar: user.imageUrl,
        company: this.companyName,
        companyId: user.spaceId,
        department: user.departmentName,
        departmentId: user.departmentId,
        id: JSON.stringify(user.id),
        name: user.name
      }
    });
    let roomRef = this.firestore.collection("companies").doc(this.chatId).collection('rooms').doc();
    const data = {
      createdAt: new Date(),
      creatorId: JSON.stringify(this.currentUser.id),
      id: roomRef.ref.id,
      membersIds: [...membersIds, JSON.stringify(this.currentUser.id)],
      name: this.form.value.name,
      picture: this.filePath || null,
      subType: 'group',
      type: 'group'
    }
    roomRef.set(data).then(() => {
      members.map((member: any) => {
        roomRef.ref.collection('members').doc(member.id).set(member).then();
      });
      roomRef.ref.collection('members').doc(JSON.stringify(this.currentUser.id)).set({
        avatar: this.currentUser.imageUrl,
        company: this.companyName,
        companyId: this.currentUser.spaceId,
        department: this.currentUser.departmentName,
        departmentId: this.currentUser.departmentId,
        id: JSON.stringify(this.currentUser.id),
        name: this.currentUser.name
      }).then(() => {
        this.chatSer.roomId.next(roomRef.ref.id);
        this.chatSer.roomUsersIds.next(members.map((member: any) => member.id));
        this.chatSer.newRoomCreated.next(true);
        this.chatSer.messages$.next([]);
        this.chatSer.getRoomChat(true)
        this.dialog.closeAll();
      });

    })
  }

  uploadImage($event: any) {
    this.imageToUpload = $event;
    let formData = new FormData();
    formData.append("uploadedFiles", this.imageToUpload);
    this.service.uploadImage(formData).subscribe((res: any) => {
      this.filePath = res.data.filePath
    });
  }

}
