import {Component, computed, Signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ServiceCategory} from "../../../../../core/interfaces/service-category";
import {environment} from "../../../../../../environments/environment";
import {Router} from "@angular/router";
import {CategoriesListService} from "../../../../../core/services/categories.service";
import {SubCategoryService} from "../../../../../core/services/sub-categories.service";

@Component({
  selector: 'categories-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent {
  categories: Signal<ServiceCategory[]> = computed(() => this.service.categories());
  imageUrl = environment.publicImageUrl;
  language = localStorage.getItem('language') || 'en'

  constructor(public service: CategoriesListService, public subCategorySer: SubCategoryService, private router: Router) {
  }


  getSubCategories(id: number) {
    this.subCategorySer.getSubCategories(id).subscribe();
    this.router.navigate(['/sessions/categories']);
  }
}
