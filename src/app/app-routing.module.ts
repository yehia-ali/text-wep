import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', loadChildren: () => import('./secure/secure.module').then(m => m.SecureModule)},
  {path: 'auth', loadChildren: () => import('./public/public.module').then(m => m.PublicModule)},
  {path: 'welcome', loadComponent: () => import('./secure/welcome/welcome.component').then(m => m.WelcomeComponent)},
  // wallet redirection
  {path: 'redirection', loadComponent: () => import('./core/components/after-payment/after-payment.component').then(m => m.AfterPaymentComponent)},
  // register and subscription redirection
  {path: 'public/auth/redirect', loadComponent: () => import('./core/components/after-payment/after-payment.component').then(m => m.AfterPaymentComponent)},
  {path: 'mobile-payment', loadComponent: () => import('./core/webviews/payment-order.component').then(m => m.PaymentOrderComponent)},
  {path: 'order-payment', loadComponent: () => import('./core/webviews/order-payment.component').then(m => m.OrderPaymentComponent)},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
