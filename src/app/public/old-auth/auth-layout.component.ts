import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LogoComponent} from "../../core/components/logo.component";
import {LanguageComponent} from "../../core/components/language.component";

@Component({
  selector: 'auth-layout',
  standalone: true,
  imports: [CommonModule, LogoComponent, LanguageComponent],
  template: `
    <div class="top-section flex aic jcsb">
      <logo [large]="true"></logo>
      <language></language>
    </div>
      <div class="auth-layout h-100v">
          <div class="flex-grid">
              <div class="col-xl-7 d-none d-xl-flex">
                  <div class="img h-100 flex-center">
                      <img src="assets/images/auth/{{img}}.svg" alt="auth image">
                  </div>
              </div>
              <div class="col-xl-5">
                  <div class="bg-white">
                      <ng-content></ng-content>
                  </div>
              </div>
          </div>
      </div>
  `,
  styles: [`
    .top-section {
      position: absolute;
      top: 25px;
      inset-inline-start: 0;
      padding: 0 20px;
      width: 100%;
    }
  `]
})
export class AuthLayoutComponent {
  @Input() img!: string;
}
