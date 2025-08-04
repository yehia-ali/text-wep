import { RouterLink, RouterModule } from '@angular/router';
import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LogoComponent} from "../../core/components/logo.component";
import {LanguageComponent} from "../../core/components/language.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'auth-layout',
  standalone: true,
  imports: [CommonModule, LogoComponent, LanguageComponent , RouterModule , TranslateModule],
  template: `
      <div class="top-section flex aic jcsb px-3 w-100">
        <logo [large]="true"></logo>
        <language></language>
      </div>
    <div class="auth-bg py-3 flex aic jcc">
      <div class="bg-white auth-card  rounded-4 shadow p-3 relative">
          <div class="layout-content relative text-center">
            <a target="_blank" href="https://support.taskedin.net/guest/openticket" class="rounded bg-white  support flex-column p-1 shadow">
              <i class='bx bx-help-circle'></i>
              <p class="fs-11 simibold">{{'support' | translate}}</p>
            </a>
            <ng-content></ng-content>
          </div>
      </div>
    </div>
  `,
  styles: [`
  .support {
      bottom: -30px;
      position: absolute;
      right:-100px;
      // background-color:rgba(255,255,255,0.1);
      min-width:60px;
    }

  .auth-bg{
    background:url('../../../assets/images/auth/auth-bg-2.svg');
    background-size:cover;
    height:100vh;
    overflow:auto;

  }
    .top-section {
      position: absolute;
      top: 25px;
      inset-inline-start: 0;
      width: 100%;
    }
    .auth-card{
      max-width:480px;
      width:480px;
      overflow:visible;
    }
    // .layout-content{
    //   max-height:85vh;
    // }

    .shadow{
      box-shadow:0 24px 64px rgba(38,38,74,0.2)
    }
  `]
})
export class AuthLayoutComponent {
  @Input() img!: string;
}
