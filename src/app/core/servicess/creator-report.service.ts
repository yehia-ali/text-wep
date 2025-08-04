import {Injectable} from '@angular/core';
import {debounceTime, map, Observable, switchMap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {FiltersService} from "../services/filters.service";
import {CreatorReport} from "../interfaces/creator-report";

@Injectable({
    providedIn: 'root'
})
export class CreatorReportService extends FiltersService {
    reports$: Observable<CreatorReport[]> = this.hasChanged.pipe(debounceTime(400), switchMap(() => this.getCreatorsTable().pipe(map((res: any) => res))));

    constructor(private http: HttpClient) {
        super();
    }

    getCreatorsTable() {
        this.loading.next(true);
        const url = new URL(`${environment.apiUrl}api/TaskGroups/GetTaskGroupCreatorReport`)
        this.params(url);
        return this.http.get(`${url}`).pipe(map((res: any) => {
            this.loading.next(false)
            let reports = res.data.items;
            this.setMeta(res)
            return reports;
        }))
    }
}
