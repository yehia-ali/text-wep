import {Component} from '@angular/core';

@Component({
  selector: 'meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent {
  sidebarList = [
    {img: 'assets/images/sub-sidebar/meeting-list.svg', link: 'list', title: 'meetings_list'},
    {img: 'assets/images/sub-sidebar/start-meeting.svg', link: 'meet', title: 'start_meeting'},
    {img: 'assets/images/sub-sidebar/recordings.svg', link: 'recordings', title: 'meetings_record'},
  ];
}
