import {inject, Injectable} from '@angular/core';
import {FiltersService} from './filters.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {BehaviorSubject, debounceTime, map, switchMap, take} from 'rxjs';
import {ChatService} from "../../secure/user/chat/chat.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root',
})
export class OvertimeService extends FiltersService {
  chatSer = inject(ChatService);
  firestore = inject(AngularFirestore)
  chatLoading = new BehaviorSubject(true)
  gotChat = new BehaviorSubject(false);
  details$ = this.hasChanged.pipe(debounceTime(400), switchMap(() => this.getRequestDetails().pipe(map((res: any) => res))));
  detailsId$ = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    super();
  }

  getMyRequests() {
    return this.http.get(`${environment.apiUrl}api/OverTime/GetMyRequests`);
  }

  requestOverTime(data: any) {
    return this.http.post(
      `${environment.apiUrl}api/OverTime/RequestOverTime`,
      data
    );
  }

  getRequestDetails() {
    this.loading.next(true);
    this.chatLoading.next(true);
    return this.http.get(`${environment.apiUrl}api/OverTime/GetRequestDetails?Id=${this.detailsId$.value}`).pipe(map((res: any) => {
      let details = res.data

      const currentUser = parseInt(localStorage.getItem('id') || '');

      // to check if the current user is the creator
      details.isEmployee = details.userId == currentUser

      // to check if the current user is the assignee
      details.isManager = details.managerId == currentUser

      if ((details.isEmployee || details.isManager) && (details.isEmployee != details.isManager) && !this.gotChat.value) {
        this.createPrivateChat(
          {manager_name: details.managerName, manager_id: details.managerId, manager_image_url: details.managerPic, manager_job_title: details.managerJobTitle},
          {employee_name: details.userName, employee_id: details.userId, employee_image_url: details.userPic, employee_job_title: details.userJobTitle}
        )
      }

      if ((details.isEmployee || details.isManager) && !this.gotChat.value) {

      } else {
        this.chatLoading.next(false)
      }
      return details
    }));
  }

  overtimeApprove(data: any) {
    return this.http.post(
      `${environment.apiUrl}api/OverTime/ApproveRequest`,
      data
    );
  }

  overtimeReject(data: any) {
    return this.http.post(
      `${environment.apiUrl}api/OverTime/RejectRequest`,
      data
    );
  }

  overtimeCancel(data: any) {
    return this.http.post(
      `${environment.apiUrl}api/OverTime/CancelRequest`,
      data
    );
  }

  getHistory(id: number) {
    return this.http.get(`${environment.apiUrl}api/OverTime/GetRequestHistory?RequestId=${id}`).pipe(map((res: any) => {
      if (res.success) {
        const histories = res.data;
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
        return Object.keys(groups).map((date) => ({
          date: new Date(+date),
          messages: groups[date],
        }));
      }

      return res
    }))
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

  getUserTasks(params:HttpParams){
    return this.http.get(`${environment.apiUrl}api/Tasks/GetUserTasks` , {params}).pipe(
      map((res) => {
        return res
      })
    )
  }
}
