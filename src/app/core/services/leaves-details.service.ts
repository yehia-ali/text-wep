import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, map, mergeMap, of, switchMap, take} from "rxjs";
import {Urlify} from "../functions/urlify";
import {LeavesDetails} from "../interfaces/leaves-details";
import {ChatService} from "../../secure/user/chat/chat.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class LeavesDetailsService {
  hasChanged = new BehaviorSubject(false);
  loading = new BehaviorSubject(true);
  id = new BehaviorSubject(0);
  chatLoading = new BehaviorSubject(true)
  gotChat = new BehaviorSubject(false);
  details = new BehaviorSubject({});
  statistics = new BehaviorSubject<any>([]);
  chatSer = inject(ChatService);
  firestore = inject(AngularFirestore)

  constructor(private http: HttpClient) {
  }

  getRequestDetails() {
    this.loading.next(true);
    this.chatLoading.next(true);
    return this.http.get(`${environment.apiUrl}api/Leave/GetRequestDetails?requestId=${this.id.value}`).pipe(map((res: any) => {
      const details: LeavesDetails = res.data;
      const currentUser = parseInt(localStorage.getItem('id') || '');

      // to check if the current user is the creator
      details.isEmployee = details.employee_id == currentUser

      // to check if the current user is the assignee
      details.isManager = details.manager_id == currentUser

      if ((details.isEmployee || details.isManager) && !this.gotChat.value) {
        this.createPrivateChat(
          {manager_name: details.manager_name, manager_id: details.manager_id, manager_image_url: details.manager_image_url, manager_job_title: details.manager_job_title},
          {employee_name: details.employee_name, employee_id: details.employee_id, employee_image_url: details.employee_image_url, employee_job_title: details.employee_job_title})

        this.chatLoading.next(false);
        this.gotChat.next(true)
      }

      // Filter out attachments with fileType 5 and update soundDescription
      details.leaveAttachments = details.leaveAttachments.filter((attachment: any) => {
        return attachment.fileType !== 5;
      });

      // Urlify reaosn
      if (details.reason) details.reason = Urlify(details.reason);

      this.getHistory(details.id).pipe(mergeMap((leaveHistory) => {
        let leaveHistoryRes: any = leaveHistory;
        if (leaveHistoryRes.success) {
          const histories = leaveHistoryRes.data;
          // Group histories by date
          const groups = histories.reduce((groups: any, history: any) => {
            const date = new Date(new Date(history.creationDate).setHours(0, 0, 0, 0)).getTime();
            if (!groups[date]) {
              groups[date] = [];
            }
            groups[date].push(history);
            return groups;
          }, {});

          // Format histories into an array
          details.histories = Object.keys(groups).map((date) => ({
            date: new Date(+date),
            messages: groups[date],
          }));
        }
        this.loading.next(false);
        if ((details.isEmployee || details.isManager) && !this.gotChat.value) {

        } else {
          this.chatLoading.next(false)
        }
        this.details.next(details);
        return of(details);
      })).subscribe()


      this.getBalances().subscribe((res: any) => {
        this.statistics.next([
          {
            title: 'total',
            value: res.data.total_leave,
            icon: 'total.svg',
            color: '#7B55D3',
          },
          {
            title: 'used',
            value: res.data.used_leave,
            icon: 'used.svg',
            color: '#D32F2F',
          },
          {
            title: 'balance',
            value: res.data.balance_leave,
            icon: 'balance.svg',
            color: '#29CC99',
          },
        ]);
      });
      return details;
    }))
  }


  getHistory(id: number) {
    return this.http.get(`${environment.apiUrl}api/Leave/GetRequestHistory?RequestId=${id}`)
  }

  getBalances() {
    return this.http.get(`${environment.apiUrl}api/Leave/balances`)
  }

  createPrivateChat(manager: {
    manager_id: number,
    manager_name: string,
    manager_job_title: string,
    manager_image_url: string,
  }, employee: {
    employee_id: number,
    employee_name: string,
    employee_job_title: string,
    employee_image_url: string
  }) {
    let id: any;
    if (employee.employee_id) {
      id = +employee.employee_id > manager.manager_id ? `${employee.employee_id}_${manager.manager_id}` : `${manager.manager_id}_${employee.employee_id}`
    }
    this.firestore.collection("companies").doc(localStorage.getItem('chat-id') || '').collection('rooms').doc(id).snapshotChanges().pipe(take(1)).subscribe(res => {
      // if there is an existing room
      if (!!res.payload.data()) {
        this.chatSer.roomId.next(id);
        this.chatSer.roomUsersIds.next([manager.manager_id, employee.employee_id]);
        this.chatSer.newRoomCreated.next(true);
        this.chatSer.getRoomChat(true)
      } else {
        let members = [
          {
            avatar: manager.manager_image_url,
            company: 'this.companyName',
            companyId: localStorage.getItem('space-id'),
            department: 'manager.departmentName',
            departmentId: JSON.stringify('manager.departmentId'),
            id: JSON.stringify(manager.manager_id),
            name: manager.manager_name,
          },
          {
            avatar: employee.employee_image_url,
            company: 'this.companyName',
            companyId: JSON.stringify(localStorage.getItem('space-id')),
            department: 'employee.departmentName',
            departmentId: JSON.stringify('employee.departmentId'),
            id: JSON.stringify(employee.employee_id),
            name: employee.employee_name,
          },
        ]
        const data = {
          createdAt: new Date(),
          id,
          members,
          membersIds: [JSON.stringify(manager.manager_id), JSON.stringify(employee.employee_id)],
          subType: 'private',
          type: 'private',
        }
        this.firestore.collection("companies").doc(localStorage.getItem('chat-id') || '').collection('rooms').doc(id).set(data).then(() => {
          this.chatSer.roomId.next(id);
          this.chatSer.roomUsersIds.next([manager.manager_id, employee.employee_id]);
          this.chatSer.newRoomCreated.next(true);
          this.chatSer.messages$.next([]);
          this.chatSer.getRoomChat(true);
        })
      }
    })
  }

}
