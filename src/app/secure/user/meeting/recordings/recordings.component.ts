import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LayoutComponent} from "../../../../core/components/layout.component";

@Component({
  selector: 'recordings',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  templateUrl: './recordings.component.html',
  styleUrls: ['./recordings.component.scss']
})
export class RecordingsComponent {

}
