import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WalletComponent} from "./wallet.component";

const routes: Routes = [{
  path: "", component: WalletComponent, title: 'Taskedin - Wallet'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletRoutingModule { }
