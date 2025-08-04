import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { SubCategoryService } from './sub-categories.service';
import {ServiceCategory} from "../interfaces/service-category";

@Injectable({
  providedIn: 'root'
})
export class CategoriesListService {
  categories = signal<ServiceCategory[]>([]);

  constructor(private http: HttpClient, private subCategorySer: SubCategoryService) {
  }

  getCategories() {
    this.categories.set([]);
    return this.http.get(`${environment.publicUrl}ServiceCategory/GetAll`).pipe(map((res: any) => {
      this.categories.set(res.data.items);
      this.subCategorySer.getSubCategories(res.data.items[0].id).subscribe();
      return res.data.items;
    }))
  }
}
