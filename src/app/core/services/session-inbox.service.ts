import {Injectable} from '@angular/core';
import {debounceTime, map, Observable, switchMap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {SessionInbox} from "../interfaces/session-inbox";
import {FiltersService} from "./filters.service";
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class SessionInboxService extends FiltersService {
    mySessions$: Observable<SessionInbox[]> = this.hasChanged.pipe(debounceTime(400), switchMap(_ => this.getMySessions().pipe(map((res: any) => {
        this.loading.next(false);
        return res.data.items;
    }))));

    constructor(private http: HttpClient) {
        super();
        this.hasChanged.pipe(map(_ => this.loading.next(true))).subscribe();
    }

    getMySessions() {
        let url = new URL(`${environment.publicUrl}SessionDate/GetInbox`);
        this.params(url);
        return this.http.get(`${url}`).pipe(map((res: any) => {
            this.setMeta(res);
            return res;
        }));
    }
}
