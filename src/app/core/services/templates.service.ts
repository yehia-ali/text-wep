import {Injectable} from '@angular/core';
import {BehaviorSubject, map} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {GlobalService} from "./global.service";
import {environment} from "../../../environments/environment";
import {FiltersService} from "./filters.service";

@Injectable({
  providedIn: 'root'
})
export class TemplatesService extends FiltersService {

  templates = new BehaviorSubject([]);
  categories = new BehaviorSubject([]);
  category = new BehaviorSubject<any>('');
  isSuperAdmin = localStorage.getItem('is-super-admin');

  constructor(private http: HttpClient) {
    super();
  }

  getTemplates() {
    const url = new URL(`${environment.apiUrl}api/TaskTemplate/${this.isSuperAdmin ? 'GetGlobal' : 'GetAll'}`)
    this.params(url, 'templates');
    this.category.value.length > 0 && this.category.value.forEach((category: any) => {
      url.searchParams.append('taskTemplateCategories', category)
    })
    return this.http.get(`${url}`).pipe(map((res: any) => {
      let templates = res.data.items;
      this.setMeta(res);
      this.templates.next(templates)
      this.loading.next(false);
      return templates
    }))
  }

  getCategories() {
    const url = new URL(`${environment.apiUrl}api/TaskTemplateCategories/${this.isSuperAdmin ? 'GetGlobal' : 'GetAll'}`)
    return this.http.get(`${url}`).pipe(map((res: any) => {
      let categories = res.data.items;
      this.categories.next(categories)
      return categories
    }))
  }
  getTemplateStages(params:HttpParams) {
    const url = new URL(`${environment.apiUrl}api/TaskTemplate/GetTemplateStages/`)
    return this.http.get(`${url}` , {params}).pipe(map((res: any) => {
      return res
    }))
  }

  addTemplate(data: any) {
    return this.http.post(`${environment.apiUrl}api/TaskTemplate/Create${this.isSuperAdmin ? 'Global' : ''}`, data)
  }

  deleteTemplate(id: number) {
    return this.http.put(`${environment.apiUrl}api/TaskTemplate/Delete${this.isSuperAdmin ? 'Global' : ''}`, {id})
  }

  deleteTodo(id: number) {
    return this.http.put(`${environment.apiUrl}api/TaskTemplateTodoList/Delete${this.isSuperAdmin ? 'Global' : ''}`, {id})
  }

  createTodo(data: any) {
    return this.http.post(`${environment.apiUrl}api/TaskTemplateTodoList/Create${this.isSuperAdmin ? 'Global' : ''}`, data)
  }

  updateTodo(data: any) {
    return this.http.put(`${environment.apiUrl}api/TaskTemplate/Update${this.isSuperAdmin ? 'Global' : ''}`, data)
  }

  addCategory(data: any) {
    return this.http.post(`${environment.apiUrl}api/TaskTemplateCategories/Create${this.isSuperAdmin ? 'Global' : ''}`, data)
  }

  deleteCategory(id: number) {
    return this.http.put(`${environment.apiUrl}api/TaskTemplateCategories/Delete${this.isSuperAdmin ? 'Global' : ''}`, {id})
  }

  updateCategory(data: any) {
    return this.http.put(`${environment.apiUrl}api/TaskTemplateCategories/Update${this.isSuperAdmin ? 'Global' : ''}`, data)
  }

  getGlobalTemplates(params:HttpParams) {
    return this.http.get(`${environment.apiUrl}api/TaskTemplate/GetGlobal` , {params}).pipe(map((res:any) => {
      return res
    }))
  }

  getSpaceTemplates(params:HttpParams) {
    return this.http.get(`${environment.apiUrl}api/TaskTemplate/GetAll` , {params}).pipe(map((res:any) => {
      return res
    }))
  }

  addStage(data: any) {
    return this.http.post(`${environment.apiUrl}api/TaskTemplate/CreateStage`, data)
  }
  editStage(data: any) {
    return this.http.post(`${environment.apiUrl}api/TaskTemplate/UpdateStage`, data)
  }
  deleteStage(id: number) {
    return this.http.get(`${environment.apiUrl}api/TaskTemplate/DeleteTemplateStage?StageId=${id}`)
  }
}
