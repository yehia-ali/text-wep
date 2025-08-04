import {effect, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map} from "rxjs";
import {ServiceProvider} from "../interfaces/service-provider";

@Injectable({
  providedIn: 'root'
})
export class ServiceProvidersService {
  serviceProviders = signal<ServiceProvider[]>([]);
  ServiceSubCategoryId = signal<number>(0);
  serviceProvider = signal<any>({});
  loading = signal<boolean>(true);
  search = signal<string>('');
  timeout: any;

  getServiceProviders(id: number) {
    this.serviceProviders.set([])
    this.ServiceSubCategoryId.set(id);
    this.loading.set(true);
    let url = new URL(`${environment.publicUrl}UserProfile/GetServiceProviders`);
    this.search() && url.searchParams.append('search', this.search().toString());
    url.searchParams.append('ServiceSubCategoryId', id.toString());
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.serviceProviders.set(res.data.items);
      this.loading.set(false);
      return res.data.items;
    }))
  }

  getServiceProvider(id: string) {
    let url = new URL(`${environment.publicUrl}UserProfile/GetUserProfile`);
    url.searchParams.append('id', id);
    return this.http.get(`${url}`).pipe(map((res: any) => {
      if (res.success) {
        this.serviceProvider.set(res.data);
      }
      return res.data;
    }))
  }

  constructor(private http: HttpClient) {
    effect(() => {
      this.search();
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        if (this.ServiceSubCategoryId() != 0) {
          this.getServiceProviders(this.ServiceSubCategoryId()).subscribe();
        }
      }, 300)
    }, {allowSignalWrites: true});
  }
}
