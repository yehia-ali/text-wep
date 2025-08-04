import {Injectable} from '@angular/core';
import {BehaviorSubject, map} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  countries = new BehaviorSubject([]);

  constructor(private http: HttpClient) {
  }

  getCountries() {
    return this.http.get(`${environment.apiUrl}api/Country/GetAll`).pipe(map((res: any) => {
      this.countries.next(res.data.items)
      return res.data.items
    }))
  }
}
