import {AfterViewInit, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from "@angular/router";
import {MeetingService} from "../../../../core/services/meeting.service";
import {UserService} from "../../../../core/services/user.service";

import {environment} from "../../../../../environments/environment";

declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'meet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.scss']
})
export class MeetComponent implements OnInit, AfterViewInit, OnDestroy {
  meetingSer = inject(MeetingService);
  userSer = inject(UserService);
  domain: string = "meeting.taskedin.net"; // For self hosted use your domain
  room: any;
  options: any;
  api: any;
  user: any;

  // For Custom Controls
  isAudioMuted = false;
  isVideoMuted = false;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.room = this.meetingSer.meetingName$.value || this.userSer.user$.value.memberCode; // Set your room name
    this.user = {
      name: this.userSer.user$.value.name // Set your username
    }
  }

  ngAfterViewInit(): void {
    this.options = {
      roomName: this.room,
      lang: localStorage.getItem('language'),
      width: '100%',
      height: '90vh',
      configOverwrite: {
        prejoinPageEnabled: false,
        startWithVideoMuted: true,
        startWithAudioMuted: true,
      },
      interfaceConfigOverwrite: {
        // overwrite interface properties
      },
      parentNode: document.querySelector('#jitsi-iframe'),

      userInfo: {
        displayName: this.user.name,
      }
    }

    this.api = new JitsiMeetExternalAPI(this.domain, this.options);

    // Event handlers
    this.api.addEventListeners({
      readyToClose: this.handleClose,
      participantLeft: this.handleParticipantLeft,
      participantJoined: this.handleParticipantJoined,
      videoConferenceJoined: this.handleVideoConferenceJoined,
      videoConferenceLeft: this.handleVideoConferenceLeft,
      audioMuteStatusChanged: this.handleMuteStatus,
      videoMuteStatusChanged: this.handleVideoStatus
    });
    this.api.executeCommand('avatarUrl', environment.imageUrl + this.userSer.user$.value.imageUrl);
    // setTimeout(() => {
    //   this.api.executeCommand('toggleAudio', true);
    //   this.api.executeCommand('toggleVideo', true);
    // }, 1600)
  }

  handleClose = () => {
    console.log("handleClose");
  }

  handleParticipantLeft = async (participant: any) => {
    console.log("handleParticipantLeft", participant); // { id: "2baa184e" }
    const data = await this.getParticipants();
  }

  handleParticipantJoined = async (participant: any) => {
    console.log("handleParticipantJoined", participant); // { id: "2baa184e", displayName: "Shanu Verma", formattedDisplayName: "Shanu Verma" }
    const data = await this.getParticipants();
  }

  handleVideoConferenceJoined = async (participant: any) => {
    console.log("handleVideoConferenceJoined", participant); // { roomName: "bwb-bfqi-vmh", id: "8c35a951", displayName: "Akash Verma", formattedDisplayName: "Akash Verma (me)"}
    const data = await this.getParticipants();
  }

  handleVideoConferenceLeft = () => {
    console.log("handleVideoConferenceLeft");
    this.router.navigate(['/thank-you']);
  }

  handleMuteStatus = (audio: any) => {
    console.log("handleMuteStatus", audio); // { muted: true }
  }

  handleVideoStatus = (video: any) => {
    console.log("handleVideoStatus", video); // { muted: true }
  }

  getParticipants() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.api.getParticipantsInfo()); // get all participants
      }, 500)
    });
  }

  executeCommand(command: string) {
    this.api.executeCommand(command);
    if (command == 'hangup') {
      this.router.navigate(['/thank-you']);
      return;
    }

    if (command == 'toggleAudio') {
      this.isAudioMuted = !this.isAudioMuted;
    }

    if (command == 'toggleVideo') {
      this.isVideoMuted = !this.isVideoMuted;
    }
  }

  ngOnDestroy() {
    this.meetingSer.meetingName$.next('')
  }

}
