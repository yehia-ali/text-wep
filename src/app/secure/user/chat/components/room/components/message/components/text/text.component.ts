import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Room} from "../../../../../../interfaces/room";
import { Urlify } from 'src/app/core/functions/urlify';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnInit, OnChanges {
  @Input() message!: Room;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.message.text = Urlify(this.message.text)
  }

}
