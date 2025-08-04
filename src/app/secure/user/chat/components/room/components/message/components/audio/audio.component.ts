import {Component, Input, OnInit} from '@angular/core';
import {Room} from "../../../../../../interfaces/room";
import {environment} from "../../../../../../../../../../environments/environment";

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss']
})
export class AudioComponent implements OnInit {
  @Input() message!: Room;
  apiUrl = environment.imageUrl

  constructor() {
  }

  ngOnInit(): void {
    
    document.addEventListener('play', function (e) {
      let audios = document.getElementsByTagName('audio');
      for (let i = 0; i < audios.length; i++) {
        if (audios[i] != e.target) {
          audios[i].pause();
        }
      }
    }, true);
  }

}
