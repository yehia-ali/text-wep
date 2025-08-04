import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {debounceTime, map, Observable, Subscription, switchMap} from "rxjs";
import {Transaction} from 'src/app/core/interfaces/transaction';
import {WalletService} from 'src/app/core/services/wallet.service';
import {environment} from "../../../../environments/environment";
import {LayoutService} from "../../../core/services/layout.service";
import {PageInfoService} from "../../../core/services/page-info.service";

@Component({
  selector: 'wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit, OnDestroy {
  pageInfoSer = inject(PageInfoService);
  loading = true;
  walletData$: Observable<Transaction[]> = this.service.hasChanged.pipe(debounceTime(400), switchMap(_ => this.service.getHistoryData().pipe(map((res: any) => {
    let data = res.data.items;
    data.forEach((element: any) => {
      element.creationDate = element.creationDate + 'z'
    });
    return data
  }))));
  walletData: Transaction[] = [];
  source$!: Subscription;
  source2$!: Subscription;

  constructor(public service: WalletService, private layoutSer: LayoutService) {
    this.layoutSer.withSubMenu.next(false);
  }

  ngOnInit() {
    this.pageInfoSer.pageInfoEnum.next('Wallet');
    this.source2$ = this.service.hasChanged.subscribe(_ => {
      this.loading = true;
    });

    this.source$ = this.walletData$.subscribe(res => {
      this.loading = false;
      this.walletData = res;
    });
  }

  trackBy(index: any, item: any) {
    return item.id;
  }

  ngOnDestroy() {
    this.source$.unsubscribe();
    this.source2$.unsubscribe();
    this.layoutSer.withSubMenu.next(true);
    this.pageInfoSer.pageInfoEnum.next('');
  }

  protected readonly environment = environment;
}
