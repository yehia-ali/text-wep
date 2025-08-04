import {Injectable} from '@angular/core';
import {FiltersService} from "./filters.service";
import {debounceTime, map, Observable, switchMap} from "rxjs";
import {Shift} from "../interfaces/shift";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ShiftsService extends FiltersService {
  shifts$: Observable<Shift[]> = this.hasChanged.pipe(debounceTime(400), switchMap(() => this.getShifts().pipe(map((res: any) => res))));

  constructor(private http: HttpClient) {
    super()
  }

  getShifts() {
    this.loading.next(true);
    let url = new URL(`${environment.apiUrl}api/Shifts/GetShifts`);
    this.params(url)
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.setMeta(res);
      this.loading.next(false);
      return res.data;
    }))
  }

  getShiftById(ShiftId: any) {
    let url = new URL(`${environment.apiUrl}api/Shifts/GetShiftDetails?ShiftId=${ShiftId}`);
    return this.http.get(`${url}`).pipe(map((res: any) => {
      return res.data;
    }))
  }

  addShift(data: any) {
    return this.http.post(`${environment.apiUrl}api/Shifts/AddShift`, data)
  }

  updateShift(data: any) {
    return this.http.post(`${environment.apiUrl}api/Shifts/UpdateShift`, data)
  }

  getUsers(ShiftId: any) {
    return this.http.get(`${environment.apiUrl}api/Shifts/GetShiftUsers?ShiftId=${ShiftId}`)
  }

  removeUserFromShift(shiftId: any, UserId: any) {
    return this.http.get(`${environment.apiUrl}api/Shifts/RemoveUserFromShift?ShiftId=${shiftId}&UserIds=${UserId}`)
  }

  addUsersToShift(data: any) {
    return this.http.post(`${environment.apiUrl}api/Shifts/AddUsersToShift`, data)
  }

  deleteShift(ShiftId: any) {
    return this.http.get(`${environment.apiUrl}api/Shifts/DeleteShift?ShiftId=${ShiftId}`)
  }
}
