import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {GlobalInterceptor} from "./core/interceptors/global-interceptor";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialogModule} from "@angular/material/dialog";
import {GoogleMapsModule} from "@angular/google-maps";
import {ArabicNumbersPipe} from "./core/pipes/arabic-numbers.pipe";
import {PaymentMessageComponent} from "./core/components/payment-message/payment-message.component";
import {RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module} from "ng-recaptcha";
import {environment} from "../environments/environment";
import {AngularFireMessagingModule} from "@angular/fire/compat/messaging";
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {CreateGroupChatModule} from "./core/components/create-group-chat/create-group-chat.module";
import {OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeIntl, OwlDateTimeModule, OwlNativeDateTimeModule} from '@danielmoncada/angular-datetime-picker';
import {DefaultIntl} from "./core/functions/date-time";
import { DatePipe } from '@angular/common';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const MY_NATIVE_FORMATS = {
  fullPickerInput: {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'},
  datePickerInput: {year: 'numeric', month: 'numeric', day: 'numeric'},
  timePickerInput: {hour: 'numeric', minute: 'numeric'},
  monthYearLabel: {year: 'numeric', month: 'short'},
  dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
  monthYearA11yLabel: {year: 'numeric', month: 'long'},
};

let lang = localStorage.getItem('language') || 'en';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    GoogleMapsModule,
    PaymentMessageComponent,
    RecaptchaV3Module,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    CreateGroupChatModule
  ],
  providers: [
    DatePipe,
    {provide: HTTP_INTERCEPTORS, useClass: GlobalInterceptor, multi: true},
    MatSnackBar,
    ArabicNumbersPipe,
    {provide: RECAPTCHA_V3_SITE_KEY, useValue: "6LfzTjYkAAAAABKaqfHZAuVhAs2GFNgsubkX9pLA"},
    {provide: OWL_DATE_TIME_LOCALE, useValue: lang == 'ar' ? 'ar' : 'en'},
    {provide: OwlDateTimeIntl, useClass: DefaultIntl},
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_NATIVE_FORMATS},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
