import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {UserImageComponent} from "../user-image.component";
import {NotificationsService} from "../../services/notifications.service";
import {Router} from "@angular/router";
import {Notifications} from "../../interfaces/notification";
import {TranslateModule} from "@ngx-translate/core";
import {ArabicNumbersPipe} from "../../pipes/arabic-numbers.pipe";
import {MagicScrollDirective} from "../../directives/magic-scroll.directive";
import {MatButtonModule} from "@angular/material/button";
import {ArabicDatePipe} from "../../pipes/arabic-date.pipe";
import {VoteDetailsService} from "../../services/vote-details.service";

@Component({
  selector: 'notifications',
  standalone: true,
  imports: [CommonModule, UserImageComponent, NgOptimizedImage, TranslateModule, ArabicNumbersPipe, MagicScrollDirective, MatButtonModule, ArabicDatePipe],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, AfterViewInit {
  @ViewChild("container") container!: ElementRef;
  notifications: Notifications[] = [];
  menuOpen = true;
  unSeen!: number;
  timeout: any;
  page = 2;
  totalItems!: 0;

  constructor(private service: NotificationsService, private router: Router, private voteDetailsSer: VoteDetailsService) {
  }


  ngOnInit(): void {
    this.service.notifications.subscribe(res => {
      this.notifications = res
    });

    this.getNotifications()
  }

  ngAfterViewInit() {
    this.onScroll()

  }

  onScroll() {
    this.container.nativeElement.addEventListener('scroll', () => {
      let scrollTop = this.container.nativeElement.scrollTop;
      let scrollHeight = this.container.nativeElement.scrollHeight;
      if (scrollTop + 900 >= scrollHeight && this.totalItems > this.notifications.length) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.service.getNotifications(this.page).subscribe(() => {
            this.page++;
          })
        }, 700);
      }
    })
  }

  getNotifications() {
    this.service.getNotifications(1).subscribe((res: any) => {
      this.notifications = res.data.items;
      this.unSeen = res.data.totalUnSeen;
      this.totalItems = res.data.totalItems;
    })
  }

  markAsSeen(notification: Notifications) {
    this.menuOpen = true;
    debugger
    this.service.markAsSeen(notification.id).subscribe(() => {
      this.notifications.forEach((selectedNotification: Notifications) => {
        if (selectedNotification.id === notification.id) {
          notification.isSeen = true;
          this.unSeen--;
        }
      });
      if (notification.notificationTypeId != 3 && notification.notificationTypeId != 24) {
        if (notification.notificationTypeId > 0 && notification.notificationTypeId < 18 && notification.notificationTypeId != 13 && notification.notificationTypeId != 16) {
          this.router.navigate([`/tasks/details/${notification.typeObjectId}`]);
        } else if (notification.notificationTypeId == 13) {
          this.router.navigate(['/company/requests'])
        } else if (notification.notificationTypeId > 18 && notification.notificationTypeId < 24) {
          this.voteDetailsSer.id.next(notification.typeObjectId)
          this.voteDetailsSer.hasChanged.next(true)
          this.router.navigate([`/votes/details/${notification.typeObjectId}`])
        } else if (notification.notificationTypeId > 23 && notification.notificationTypeId < 26) {
          this.router.navigate(['/admin/subscription/details'])
        }
        if (notification.notificationCategoryId == 4) {
          this.router.navigate(['/hr/leaves-requests/details/' + notification.typeObjectId])
        }

        if (notification.notificationCategoryId == 5) {
          this.router.navigate(['/hr/overtime/details/' + notification.typeObjectId])
        }
      }

      if (notification.notificationTypeId == 41) {
        this.router.navigate(['/kpis/rater-kpis/ ' + notification.typeObjectId])
      }
      if (notification.notificationTypeId == 42) {
        this.router.navigate(['/kpis/details/ ' + notification.typeObjectId])
      }

    })  
  }

  markAllAsSeen() {
    this.menuOpen = true;
    this.service.markAllNotificationsAsSeen().subscribe(() => {
      this.notifications.forEach((selectedNotification: Notifications) => {
        selectedNotification.isSeen = true;
        this.unSeen = 0;
      })
    })
  }


  @HostListener('document:click', ['$event'])
  onClick(event: any) {
    if (!this.menuOpen) {
      this.menuOpen = true
    }
  }

  trackBy(index: any, item: any) {
    return item.id;
  }
}
