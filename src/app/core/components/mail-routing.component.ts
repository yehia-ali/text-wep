import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'mail-routing',
  standalone: true,
  imports: [CommonModule],
  template: `

  `,
  styles: []
})
export class MailRoutingComponent implements OnInit, OnDestroy {
  userSer = inject(UserService);
  router = inject(Router);
  source$!: Subscription;

  ngOnInit() {
    this.source$ = this.userSer.user$.subscribe(res => {
      if (res.isMailConfigured) {
        this.router.navigate(['/email/inbox']);
      } else {
        this.router.navigate(['/email/configuration']);
      }
    })
  }

  ngOnDestroy() {
    this.source$.unsubscribe();
  }

}
