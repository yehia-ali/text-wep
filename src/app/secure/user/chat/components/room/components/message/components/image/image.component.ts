import { Component, Inject, Input, OnInit } from '@angular/core';
import { Room } from "../../../../../../interfaces/room";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { environment } from "../../../../../../../../../../environments/environment";

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {
  @Input() message!: Room;
  apiUrl = environment.imageUrl;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  openImage() {
    if (this.message && this.message.url) {
      this.dialog.open(ImagePreviewDialog, {
        panelClass: 'image-preview-dialog',
        data: {
          url: `${this.apiUrl}/${this.message.url}`
        }
      });
    } else {
      console.warn('No image URL provided in the message');
    }
  }
}

@Component({
  selector: 'image-preview-dialog',
  template: `
    <div class="image-dialog">
      <img [src]="data.url" alt="Image Preview" />
    </div>
  `,
  styles: [`
    .image-dialog {
      text-align: center;
    }
    img {
      max-width: 100%;
      max-height:800px
    }
  `]
})
export class ImagePreviewDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { url: string }) {}
}
