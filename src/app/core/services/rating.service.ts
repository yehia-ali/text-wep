import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  constructor(private http : HttpClient) {}

  rateUser(data:any){
    return this.http.post(`${environment.apiUrl}api/Rating/AddRating` , data)
  }
  updateUserRate(data:any){
    return this.http.put(`${environment.apiUrl}api/Rating/AddRating` , data)
  }
  deleteUserRate(id:any){
    return this.http.delete(`${environment.apiUrl}api/Rating/AddRating?id=${id}`)
  }

  getUserRate(data:any){
    return this.http.post(`${environment.apiUrl}api/Rating/AddRating` , data)
  }
  getAllRates(params:HttpParams){
    return this.http.get(`${environment.apiUrl}api/Rating/GetAllRatings` , {params} )
  }

}
