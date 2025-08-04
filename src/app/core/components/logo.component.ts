import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <a href="https://taskedin.net/" class="img">
      <img *ngIf="!large" [width]="logo_width" alt="" src="assets/images/logo/logo.png">
      <img *ngIf="large" alt="" src="assets/images/logo/logo.svg">
    </a>
  `,
  styleUrls: []
})
export class LogoComponent implements OnInit {
  @Input() logo_width = '35';
  @Input() large = false;

  constructor() {
  }

  ngOnInit(): void {
  }

}
