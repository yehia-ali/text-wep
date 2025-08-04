import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ArabicNumbersPipe} from "../pipes/arabic-numbers.pipe";

@Component({
  selector: 'max-length',
  standalone: true,
  imports: [CommonModule, ArabicNumbersPipe, ArabicNumbersPipe],
  template: `
    <p>{{currentLength | arabicNumbers}} / {{maxLength | arabicNumbers}}</p>
  `,
  styles: [
  ]
})
export class MaxLengthComponent {
  @Input() maxLength: number = 0;
  @Input() currentLength: number = 0;
}
