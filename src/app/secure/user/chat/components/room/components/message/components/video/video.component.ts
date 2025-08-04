import {Component, Input, OnInit} from '@angular/core';
import {Room} from "../../../../../../interfaces/room";
import {environment} from "../../../../../../../../../../environments/environment";

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
  @Input() message!: Room;
  apiUrl = environment.imageUrl
  constructor() {
  }

  ngOnInit(): void {
    document.addEventListener('play', function (e) {
      let videos = document.getElementsByTagName('video');
      for (let i = 0; i < videos.length; i++) {
        if (videos[i] != e.target) {
          videos[i].pause();
        }
      }
    }, true);
  }

}
