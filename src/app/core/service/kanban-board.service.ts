import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FiltersService } from '../services/filters.service';

@Injectable({
  providedIn: 'root'
})
export class KanbanBoardService extends FiltersService{
  url = environment.apiUrl
  constructor(private http: HttpClient) {
    super();
  }

  getUserTasks(params:HttpParams){
    return this.http.get(`${this.url}api/Tasks/GetUserTasks` , {params})
  }
  getAllTasks(params:HttpParams){
    return this.http.get(`${this.url}api/Tasks/GetAllTasks` , {params})
  }

  updateEstimate(data: any) {
    return this.http.put(`${this.url}api/Tasks/UpdateEstimatedTime`, data);
  }

  updateTaskProgress(data: any) {
    return this.http.put(`${this.url}api/Tasks/UpdateProgress`, data);
  }
  getProps(id:any){
    return this.http.post(`${environment.apiUrl}api/TaskGroups/GetTaskProps?taskId=${id}` , '')
  }
}
