import {Component, HostListener, Input, OnInit} from '@angular/core';

@Component({
  selector: 'layout-with-sidebar',
  templateUrl: './layout-with-sidebar.component.html',
  styleUrls: ['./layout-with-sidebar.component.scss']
})
export class LayoutWithSidebarComponent implements OnInit {
  open = false

  @Input() width = 30;

  constructor() {
  }

  ngOnInit(): void {
  }

  openSidebar() {
    this.open = true
  }

//  change open status on document resize and if window size is bigger than or equal 991px
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth >= 991) {
      this.open = false
    }
  }

}
