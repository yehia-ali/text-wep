import {Component, computed, Signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from "../../../../../core/components/layout.component";
import {SearchComponent} from "../../../../../core/filters/search.component";
import {NotFoundComponent} from "../../../../../core/components/not-found.component";
import {LoadingComponent} from "../../../../../core/components/loading.component";
import {environment} from "../../../../../../environments/environment";
import {ServiceSubCategory} from "../../../../../core/interfaces/service-sub-category";
import {FavouriteComponent} from "../../../../../core/components/favourite.component";
import {MagicScrollDirective} from "../../../../../core/directives/magic-scroll.directive";
import {RouterLink} from "@angular/router";
import {CategoriesListComponent} from "../categories-list/categories-list.component";
import {SubCategoryService} from "../../../../../core/services/sub-categories.service";

@Component({
  selector: 'sub-categories',
  standalone: true,
  imports: [CommonModule, LayoutComponent, SearchComponent, NotFoundComponent, LoadingComponent, FavouriteComponent, MagicScrollDirective, RouterLink, CategoriesListComponent],
  templateUrl: './sub-categories.component.html',
  styleUrls: ['./sub-categories.component.scss']
})
export class SubCategoriesComponent {
  subCategories: Signal<ServiceSubCategory[]> = computed(() => this.service.subCategories());
  loading: Signal<boolean> = computed(() => this.service.loading());
  imageUrl = environment.publicImageUrl;
  language = localStorage.getItem('language') || 'en'

  constructor(public service: SubCategoryService) {
  }

  toggleFavourite(isFavorite: boolean, id: number) {
    isFavorite ? this.service.removeFromFavourite(id).subscribe() : this.service.addToFavourite(id).subscribe();
  }
}
