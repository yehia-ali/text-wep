import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArabicDatePipe} from "../pipes/arabic-date.pipe";
import {ArabicTimePipe} from "../pipes/arabic-time.pipe";

@Component({
  selector: 'time-card',
  standalone: true,
  imports: [CommonModule, ArabicDatePipe, ArabicTimePipe],
  template: `
      <div class="card flex aic">
          <h3 class="fs-16">{{date | arabicTime:false}}</h3>
          <p class="mx-50">.</p>
          <h3 class="fs-16"> {{date | arabicDate:'navbarCard'}}</h3>
      </div>
  `,
  styles: []
})
export class NavbarTimeCardComponent implements OnInit {
  date = new Date();

  ngOnInit() {
    setInterval(() => {
      this.date = new Date();
    }, 1000)
  }
}
