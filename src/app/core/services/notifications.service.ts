import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {BehaviorSubject} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {environment} from "../../../environments/environment";
import {Notifications} from "../interfaces/notification";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  notifications = new BehaviorSubject<any>([])
  notificationsValue = []

  constructor(private http: HttpClient, private translate: TranslateService) {
    this.notifications.subscribe(res => this.notificationsValue = res)
  }

  getNotifications(page: any) {
    return this.http.get(`${environment.apiUrl}api/Notification/Get?limit=30&page=${page}`).pipe(map((res: any) => {
      let notifications = res.data.items;
      notifications.forEach((notification: Notifications) => {
        if (
          notification.notificationTypeId != 9 &&
          notification.notificationTypeId != 14 &&
          notification.notificationTypeId != 15 &&
          notification.notificationTypeId != 16 &&
          notification.notificationTypeId != 17
        ) {
          notification.message = notification.message + ` ${this.translate.instant('by')} ${notification.fromUserName}`
        }
      });
      this.notifications.next([...this.notificationsValue, ...notifications]);
      return res;
    }))
  }

  markAsSeen(id: number) {
    return this.http.put(`${environment.apiUrl}api/Notification/UpdateSeen`, {id})
  }

  markAllNotificationsAsSeen() {
    return this.http.put(`${environment.apiUrl}api/Notification/UpdateAllAsSeen`, {});
  }
}
