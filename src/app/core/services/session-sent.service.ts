import {Injectable} from '@angular/core';
import {debounceTime, map, Observable, switchMap} from "rxjs";
import {SessionSent} from "../interfaces/session-sent";
import {FiltersService} from "./filters.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class SessionSentService extends FiltersService {
    sent$: Observable<SessionSent[]> = this.hasChanged.pipe(debounceTime(400), switchMap(_ => this.getSent().pipe(map((res: any) => {
        this.loading.next(false);
        return res.data.items
    }))));

    constructor(private http: HttpClient) {
        super();
        this.hasChanged.pipe(map(_ => this.loading.next(true))).subscribe();
    }

    getSent() {
        let url = new URL(`${environment.publicUrl}SessionDate/GetOutbox`);
        this.params(url);
        return this.http.get(`${url}`).pipe(map((res: any) => {
            this.setMeta(res);
            return res;
        }));
    }
}
