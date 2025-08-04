import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  constructor(private http: HttpClient) {
  }

  getCurrencies() {
    return this.http.get(`${environment.publicUrl}Currency/GetAll`).pipe(map((res: any) => res.data.items));
  }
}
