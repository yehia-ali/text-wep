import {effect, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {map} from 'rxjs';
import {AlertService} from './alert.service';
import {ServiceSubCategory} from "../interfaces/service-sub-category";

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {
  subCategories = signal<ServiceSubCategory[]>([]);
  loading = signal<boolean>(true);
  isFavorite = signal<boolean>(false);
  search = signal<string>('');
  categoryId = signal<number>(0);
  timeout: any;

  constructor(private http: HttpClient, private alert: AlertService) {
    effect(() => {
      this.search();
      this.isFavorite();
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        if (this.categoryId() != 0) {
          this.getSubCategories(this.categoryId()).subscribe();
        }
      }, 300)
    }, {allowSignalWrites: true});
  }

  getSubCategories(id: number) {
    this.categoryId.set(id);
    this.subCategories.set([]);
    this.loading.set(true);
    let url = new URL(`${environment.publicUrl}ServiceSubCategory/GetAll`);
    url.searchParams.append('serviceCategoryId', id.toString());
    this.isFavorite() && url.searchParams.append('IsFavorite', this.isFavorite().toString());
    this.search() && url.searchParams.append('search', this.search().toString());
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.subCategories.set(res.data.items);
      this.loading.set(false);
      return res.data.items;
    }))
  }

  addToFavourite(serviceSubCategoryId: number) {
    return this.http.post(`${environment.publicUrl}UserFavoriteServiceSubCategory/SetFavoriteServiceSubCategory`, {serviceSubCategoryId}).pipe(map((res: any) => {
      if (res.success) {
        this.alert.showAlert('added_to_favorite');
      }
    }))
  }

  removeFromFavourite(serviceSubCategoryId: number) {
    return this.http.delete(`${environment.publicUrl}UserFavoriteServiceSubCategory/RemoveFavoriteServiceSubCategory?serviceSubCategoryId=${serviceSubCategoryId}`).pipe(map((res: any) => {
      if (res.success) {
        this.alert.showAlert('removed_from_favorite');
      }
    }))
  }
}
