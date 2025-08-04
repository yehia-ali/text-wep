import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Room} from "../../../../../../interfaces/room";
import {environment} from "../../../../../../../../../../environments/environment";

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit, OnChanges {
  @Input() message!: Room;
  apiUrl = environment.imageUrl
  extensionToDisplay!: string;
  extension!: any;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.message.url) {
      this.extension = this.message.url.split('.');
    }
    this.extensionToDisplay = this.extension[this.extension.length - 1];
    this.extension = this.extensionToDisplay == 'xlsx' || this.extensionToDisplay == 'pdf' || this.extensionToDisplay == 'pptx' || this.extensionToDisplay == 'docx' ? this.extensionToDisplay : 'not-found'
  }

}
