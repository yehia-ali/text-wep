import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KpisService {

  constructor(private http: HttpClient) { }
  // /api/Tasks/GetUserKpiDashboared
  url = environment.apiUrl
  getUserKpisDashboard(params:HttpParams) {
    return this.http.get(`${this.url}api/Tasks/GetUserKpiDashboared` , {params}).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  getUserKpis(params:HttpParams) {
    return this.http.get(`${this.url}api/Tasks/GetUserKpi` , {params}).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // KpiCategory

  getAllKpisCategory(params:HttpParams) {
    return this.http.get(`${this.url}api/KpiCategory/GetAll` , {params}).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  approveKpisCategory(id:any) {
    return this.http.get(`${this.url}api/KpiCategory/ApproveCategory?id=${id}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getKpisCategory(id:any) {
    return this.http.get(`${this.url}api/KpiCategory/GetById?id=${id}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  createKpisCategory(data?:any) {
    return this.http.post(`${this.url}api/KpiCategory/Create` , data)
  }

  updateKpisCategory(data?:any) {
    return this.http.put(`${this.url}api/KpiCategory/Update` , data)
  }

  deleteKpisCategory(id:any) {
    return this.http.delete(`${this.url}api/KpiCategory/Delete?id=${id}`)
  }

  // KpiCategoryEmployee


  getKpiCategoryForEmployee(params:HttpParams) {
    return this.http.get(`${this.url}api/KpiCategoryEmployee/GetKpiCategoryForEmployee` , {params}).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  GetUserTotalAchievement(params:HttpParams) {
    return this.http.get(`${this.url}api/KpiCategoryEmployee/GetMyKpisCategoryHeader`, {params}).pipe(
      map((res: any) => {
        return res;
      })
    );
  }


  assignUserToCategory(data:any) {
    return this.http.post(`${this.url}api/KpiCategoryEmployee/AssignUserToCategory` , data)
  }

  // KpiCategory
  // Kpis Crud
  getKpisHestory(params:HttpParams) {

    return this.http.get(`${this.url}api/Kpi/GetKpiHistory`,{params}).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  kpiValueTypeToolTip(itemId:any) {
    return this.http.get(`${this.url}api/Kpi/KpiValueTypeToolTip?kpiValueType=${itemId}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  getAllKpis(params : HttpParams) {
    return this.http.get(`${this.url}api/Kpi/GetAll` , {params}).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  getAllKpisByCategoryId(params : HttpParams) {
    return this.http.get(`${this.url}api/Kpi/GetAllByCategoryId` , {params}).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  getKpiById(id:any) {
    return this.http.get(`${this.url}api/Kpi/GetById?id=${id}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  approveKpis(id:any) {
    return this.http.get(`${this.url}api/Kpi/ApproveKpi?id=${id}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getKpiValueType(params:HttpParams) {
    return this.http.get(`${this.url}api/Kpi/GetKpiValueType` , {params}).pipe(
      map((res: any) => {
        return res;
      })
    );
  }


  createKpi(data:any) {
    return this.http.post(`${this.url}api/Kpi/Create` , data)
  }

  updateKpi(data:any) {
    return this.http.put(`${this.url}api/Kpi/Update` , data)
  }

  deleteKpi(id:any) {
    return this.http.delete(`${this.url}api/Kpi/Delete?id=${id}`)
  }
  // Kpis Crud

  // Kpis user

  getEmployeeSKpis(params:HttpParams) {
    return this.http.get(`${this.url}api/KpiEmployee/GetKpisPerEmployee` , {params}).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  getRaterKpis(params:HttpParams) {
    return this.http.get(`${this.url}api/KpiEmployee/GetRaterKpis` ,{params}).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getMyEmployeesKpis(params:HttpParams) {
    return this.http.get(`${this.url}api/KpiEmployee/GetMyEmployeeKpis`, {params}).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  getMyKpisHeader(params:HttpParams) {
    return this.http.get(`${this.url}api/KpiEmployee/GetMyKpisHeader`, {params}).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  getAllEmployeesKpis(params:HttpParams) {
    return this.http.get(`${this.url}api/KpiEmployee/GetAllEmployeeKpis`, {params}).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  getMyKpis(params:HttpParams) {
    return this.http.get(`${this.url}api/KpiEmployee/GetMyKpis` , {params}).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  getKpiDetailsById(id:any) {
    return this.http.get(`${this.url}api/KpiEmployee/GetEmployeeKpiById?id=${id}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  addTaskToKpi(data:any) {
    return this.http.post(`${this.url}api/KpiEmployee/AddTaskToKpi` , data)
  }

  evaluateKpis(data:any) {
    return this.http.post(`${this.url}api/KpiEmployee/EvaluateKpi` , data)
  }
  assignKpis(data:any) {
    return this.http.post(`${this.url}api/KpiEmployee/AssignEmployeeToKpi` , data)
  }

  getAllEmployeesWithkpi(params:HttpParams) {
    return this.http.get(`${this.url}api/KpiEmployee/GetAllEmployeesWithkpi` ,{params}).pipe(
      map((res: any) => {
        return res;
      })
    );
  }


  updateAssignKpi(data:any) {
    return this.http.post(`${this.url}api/KpiEmployee/UpdateKpiEMployee` , data)
  }
  addRaterKpi(data:any) {
    return this.http.post(`${this.url}api/KpiEmployee/AddRaterToEpmloyeeKpi` , data)
  }

  deleteUserKpi(id:any) {
    return this.http.delete(`${this.url}api/KpiEmployee/DeleteEmployeeKpi?id=${id}`)
  }
  // Kpis user

  getTeamKpi(params:HttpParams) {
    return this.http.get(`${this.url}api/KpiCategoryEmployee/GetTeamKpi` , {params}).pipe(
      map((res: any) => {
        return res;
      })
    );
  }


}
