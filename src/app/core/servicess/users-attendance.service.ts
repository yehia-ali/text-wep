import {Injectable} from '@angular/core';
import {debounceTime, map, Observable, switchMap} from "rxjs";
import {FiltersService} from "../services/filters.service";
import {HttpClient} from "@angular/common/http";
import {UsersAttendance} from "../interfaces/users-attendance";
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class UsersAttendanceService extends FiltersService {
    reports$: Observable<UsersAttendance[]> = this.hasChanged.pipe(debounceTime(400), switchMap(() => this.getAttendance().pipe(map((res: any) => res))));
    geoCoder = new google.maps.Geocoder();

    constructor(private http: HttpClient) {
        super();
    }

    getAttendance() {
        this.loading.next(true);
        const url = new URL(`${environment.apiUrl}api/Attendance/GetAll`);
        this.params(url, 'users-attendance');
        return this.http.get(`${url}`).pipe(map((res: any) => {
            this.loading.next(false);
            let reports = res.data.items;
            reports.map((report: any) => {
                this.geoCoder?.geocode({
                    'location': {lat: report.latitude, lng: report.longitude}
                }, (results: any, status: any) => {
                    if (status === 'OK') {
                        if (results[0]) {
                            report.address = results[0].formatted_address;
                        }
                    }
                });
            })
            this.setMeta(res);
            return reports;
        }))
    }

    updateAttendance(data:any){
      return this.http.post(`${environment.apiUrl}api/Attendance/UpdateEmployeeAttendance` , data)
    }
}
