import {Injectable, signal} from '@angular/core';
import {SessionDetails} from "../interfaces/session-details";
import {BehaviorSubject, map} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AlertService} from "./alert.service";

@Injectable({
    providedIn: 'root'
})
export class SessionDetailsService {
    sessionDetails = signal<SessionDetails>({} as SessionDetails)
    sessionId = new BehaviorSubject(0);
    hasChanged = new BehaviorSubject(false);

    constructor(private http: HttpClient, private alert: AlertService) {
        this.hasChanged.subscribe((res: any) => {
            if (res) {
                this.getSessionDetails().subscribe();
            }
        });
    }

    getSessionDetails() {
        return this.http.get(`${environment.publicUrl}SessionDate/GetSessionDateDetails?SessionDateId=${this.sessionId.value}`).pipe(map((res: any) => {
            let currentUserId = localStorage.getItem('public-user-id') + '';
            let data: SessionDetails = res.data;
            data.isConsultant = data.consulaltantId == parseInt(currentUserId);
            data.isAttendee = data.attendeeId == parseInt(currentUserId);
            data.userName = data.isConsultant ? data.attendeeUserName : data.consulaltantUserName;
            data.userImage = data.isConsultant ? data.attendeeImage : data.consulaltantImage;
            data.userJobTitle = data.isConsultant ? data.attendeeJobTitle : data.consulaltantJobTitle;
            // check if the session end date passed 48 hours or not
            let diff = Math.abs(new Date(data.endDate).getTime() - new Date().getTime());
            let diffHours = Math.ceil(diff / (1000 * 3600));
            data.raiseIssue = diffHours < 48 && (data.sessionAttendeesStatus == 6 || data.sessionAttendeesStatus == 7);
            this.sessionDetails.set(data);
            return res;
        }))
    }

    startSession() {
        return this.http.put(`${environment.publicUrl}SessionDate/Start`, {id: this.sessionId.value})
    }

    openSession(id: number) {
        return this.http.get(`${environment.publicUrl}Meet/JoinMeeting?sessionDateId=${id}`)
    }

    endSession() {
        return this.http.put(`${environment.publicUrl}SessionDate/End`, {id: this.sessionId.value})
    }

    cancelSession() {
        return this.http.put(`${environment.publicUrl}SessionDate/Cancel`, {id: this.sessionId.value})
    }

    rateSession(data: any) {
        return this.http.post(`${environment.publicUrl}SessionDate/Rate`, data)
    }

    raiseIssue(data: any) {
        return this.http.post(`${environment.supportUrl}guestOpenticket`, data)
    }

    getRecord(id: number) {
        return this.http.get(`${environment.publicUrl}Meet/GetMyRecording?id=${id}`)
    }

    approveRequest(id: number) {
        return this.http.put(`${environment.publicUrl}SessionDate/Approve`, {id}).pipe(map((res: any) => {
            if (res.success) {
                this.alert.showAlert('session_approved')
            }
            return res;
        }));
    }

    rejectRequest(id: number) {
        return this.http.put(`${environment.publicUrl}SessionDate/Reject`, {id}).pipe(map((res: any) => {
            if (res.success) {
                this.alert.showAlert('session_rejected')
            }
            return res;
        }));
    }

    getHistory() {
        return this.http.get(`${environment.publicUrl}SessionHistory/Get?SessionAttendeeId=${this.sessionId.value}`).pipe(map((res: any) => {
            if (res.success) {
                let histories = res.data;
                // this gives an object with dates as keys
                const groups = histories.reduce((groups: any, history: any) => {
                    const date = new Date(new Date(history.creationDate).setHours(0, 0, 0, 0)).getTime();
                    if (!groups[date]) {
                        groups[date] = [];
                    }
                    groups[date].push(history);
                    return groups;
                }, {});

                // Edit: to add it in the array format instead
                return Object.keys(groups).map((date) => {
                    return {
                        date: new Date(+date),
                        messages: groups[date],
                    };
                })
            } else {
                return res
            }
        }))
    }

}
