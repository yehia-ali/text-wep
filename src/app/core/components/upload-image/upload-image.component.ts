import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
})
export class UploadImageComponent implements OnInit {
  @Input() img: any;
  @Input() imageUrl = environment.imageUrl;
  @Input() dim = 160;
  @Input() updateable: boolean = true;
  @Output() file = new EventEmitter()

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  change($event: any) {
    this.file.emit($event.target.files[0]);
  }

  updateImage() {
    let _input = document.getElementById('img-input')!
    _input.click();
  }

  // previewImage() {
  //   this.dialog.open(ImagePreviewComponent, {
  //     panelClass: 'image-preview-dialog',
  //     data: {
  //       url: this.img,
  //       profile: true
  //     }
  //   })
  // }
}
