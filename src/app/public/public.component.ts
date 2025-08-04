import {Component, inject, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {

  router = inject(Router)

  ngOnInit() {
    let token = localStorage.getItem('token');
    let spaceId = localStorage.getItem('space-id');
    if (token && spaceId) {
      this.router.navigate(['/']);
    } else if (token && !spaceId) {
      this.router.navigate(['/welcome']);
    }
  }

}
