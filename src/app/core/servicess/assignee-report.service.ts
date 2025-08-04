import {Injectable} from '@angular/core';
import {debounceTime, map, Observable, switchMap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {FiltersService} from "../services/filters.service";
import {AssigneeReport} from "../interfaces/assignee-report";

@Injectable({
    providedIn: 'root'
})
export class AssigneeReportService extends FiltersService {
    reports$: Observable<AssigneeReport[]> = this.hasChanged.pipe(debounceTime(400), switchMap(() => this.getAssigneesTable().pipe(map((res: any) => res))));


    constructor(private http: HttpClient) {
        super();
        this.search.pipe(debounceTime(700), switchMap(() => this.getAssigneesTable()))
    }

    getAssigneesTable() {
        this.loading.next(true)
        const url = new URL(`${environment.apiUrl}api/Tasks/GetTaskAssigneeReport`)
        this.params(url);
        return this.http.get(`${url}`).pipe(map((res: any) => {
            this.loading.next(false)
            let reports = res.data.items;
            this.setMeta(res)
            return reports;
        }))
    }
}
