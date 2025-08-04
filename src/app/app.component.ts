import {Component, ElementRef, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, NavigationExtras, NavigationStart, Router} from "@angular/router";
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  language = localStorage.getItem('language') || 'ar';

constructor(
  private translate: TranslateService,
  private router: Router,
  private elm: ElementRef,
  private route: ActivatedRoute,
  private primengConfig: PrimeNGConfig
) {
  this.route.queryParams.subscribe(params => {
    const language = params['language'];

    if (language) {
      localStorage.setItem('language', language);
      this.language = language;
    }
    // تحديث لغة الترجمة
    this.translate.use(this.language);
    // تحديث اتجاه الصفحة
    document.dir = this.language === 'ar' ? 'rtl' : 'ltr';

    this.translate.setDefaultLang(this.language);
    // تحديث ترجمة PrimeNG
    this.translate.get('primeng').subscribe((res: any) => {
      this.primengConfig.setTranslation(res);
    });

    // إزالة باراميتر اللغة من الـ URL
    this.removeLanguageParam();
  });
}


removeLanguageParam() {
  this.route.queryParams.subscribe(params => {
    if (params['language']) {
      const newParams = { ...params }; // الاحتفاظ بجميع الباراميترات الحالية
      delete newParams['language']; // حذف `language` فقط

      this.router.navigate([], {
        queryParams: newParams,
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    }
  });
}

  ngOnInit() {
    if (localStorage.getItem('mode') == 'dark') {
      document.body.classList.add('dark-mode')
    }
    this.resetTasksLayoutHeight();
    this.router.events.subscribe((res: any) => {
      if (res instanceof NavigationStart) {
        this.resetTasksLayoutHeight();
      }
    })

  }

  resetTasksLayoutHeight() {
    setTimeout(() => {
      let filters = this.elm.nativeElement.querySelector('.layout-with-filters .filters');
      if (filters) {
        let content = this.elm.nativeElement.querySelector('.layout-with-filters .content');
        let observer = new ResizeObserver(entries => {
          let filtersHeight = entries[0].contentRect.height;
          content.style.height = `calc(100% - (${filtersHeight + 72}px)`;
        });
        observer.observe(filters);
      }
    }, 500);
  }

}
