import {Component, computed, OnDestroy, OnInit, Signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Subscription} from "rxjs";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {ServiceProvider} from 'src/app/core/interfaces/service-provider';
import {ServiceProvidersService} from "../../../../../core/services/service-providers.service";
import {SearchComponent} from "../../../../../core/filters/search.component";
import {LayoutComponent} from "../../../../../core/components/layout.component";
import {CategoriesListComponent} from "../categories-list/categories-list.component";
import {MagicScrollDirective} from "../../../../../core/directives/magic-scroll.directive";
import {UserImageComponent} from "../../../../../core/components/user-image.component";
import {TranslateModule} from "@ngx-translate/core";
import {NotFoundComponent} from "../../../../../core/components/not-found.component";
import {LoadingComponent} from "../../../../../core/components/loading.component";
import {VerifiedComponent} from "../../../../../core/components/verified.component";
import {environment} from "../../../../../../environments/environment";
import {ArabicNumbersPipe} from "../../../../../core/pipes/arabic-numbers.pipe";

@Component({
  selector: 'service-providers-list',
  standalone: true,
  imports: [CommonModule, SearchComponent, LayoutComponent, CategoriesListComponent, MagicScrollDirective, RouterLink, UserImageComponent, TranslateModule, NotFoundComponent, LoadingComponent, VerifiedComponent, ArabicNumbersPipe],
  templateUrl: './service-providers-list.component.html',
  styleUrls: ['./service-providers-list.component.scss']
})
export class ServiceProvidersListComponent implements OnInit, OnDestroy {
  source$!: Subscription;
  serviceProviders: Signal<ServiceProvider[]> = computed(() => this.service.serviceProviders());
  loading: Signal<boolean> = computed(() => this.service.loading());

  sortList = [
    {name: 'highest_price', value: 1},
    {name: 'lowest_price', value: 2},
    {name: 'experience', value: 3},
    {name: 'rate', value: 4},
    {name: 'available_today', value: 5},
  ]
  protected readonly environment = environment;

  constructor(public service: ServiceProvidersService, private route: ActivatedRoute) {
  }

  sort(value: any) {
  }

  ngOnInit(): void {
    this.source$ = this.route.params.subscribe(params => {
      this.service.getServiceProviders(params['sub-id']).subscribe()
    })
  }

  ngOnDestroy(): void {
    this.source$.unsubscribe()
  }
}
