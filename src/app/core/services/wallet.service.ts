import {Injectable} from '@angular/core';
import {BehaviorSubject, map} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {environment} from "../../../environments/environment";
import {FiltersService} from "./filters.service";

@Injectable({
  providedIn: 'root'
})
export class WalletService extends FiltersService {
  walletPassword = new BehaviorSubject(false);
  hasWalletAccount = new BehaviorSubject(false);
  balanceChanged = new BehaviorSubject<boolean>(false)

  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog) {
    super();
  }

  hasAccount() {
    return this.http.get(`${environment.publicUrl}UserProfile/GetMyProfile`).pipe(map((res: any) => {
      if (!res.success && res.code == 310) {
        // this.getAuthenticatedUserData().subscribe((userData: any) => {
        //   let data = userData.data;
        //   this.createWalletProfile(data).subscribe()
        // })
      } else {
        this.hasWalletAccount.next(true);
        this.walletPassword.next(true);
        this.router.navigate(['/wallet']).then(() => {
          this.walletPassword.next(false);
          this.dialog.closeAll();
        });
      }
    }));
  }

  createWalletProfile(data: any) {
    return this.http.post(`${environment.publicUrl}UserProfile/CreateUserProfile`, data, {
      headers: new HttpHeaders({
        "Authorization": localStorage.getItem('walletToken') + '',
      })
    }).pipe(map((res: any) => {
      if (res.success) {
        this.hasWalletAccount.next(true);
        this.walletPassword.next(true);
        this.router.navigate(['/wallet']).then(() => {
          this.walletPassword.next(false);
          this.dialog.closeAll();
        });

      }
    }));
  }

  SendMoney(data: any) {
    return this.http.post(`${environment.publicUrl}Wallet/SendMoney`, data, {
      headers: new HttpHeaders({
        "Authorization": localStorage.getItem('walletToken') + '',
      })
    });
  }

  getHistoryData() {
    let url = new URL(`${environment.publicUrl}Wallet/GetWalletTransactionHistory`);
    this.params(url);
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.setMeta(res);
      return res;
    }));
  }

  getBalance() {
    return this.http.get(`${environment.publicUrl}Wallet/GetWalletBalance`);
  }

  addBalance(amount: number) {
    return this.http.get(`${environment.publicUrl}Wallet/RechargeWallet?amount=${amount}`);
  }

  getWalletInfo(phoneNumber: any) {
    return this.http.get(`${environment.publicUrl}UserProfile/GetProfileByPhoneNumber?PhoneNumber=${phoneNumber}`);
  }

  confirmPassword(password: string) {
    return this.http.post(`${environment.coreBase}/api/Authentication/WalletLogin`, {password}).pipe(map((res: any) => {
      if (res.success) {
        localStorage.setItem('walletToken', res.data.accessToken);
      }
      return res;
    }));
  }

  // getAuthenticatedUserData() {
  //   return this.http.post(`${environment.taskedinPreUrl}api/Authentication/GetAuthenticatedUser`, {});
  // }

  getPdf(id: number) {
    return this.http.get(`${environment.publicUrl}Wallet/GetTransactionPDF?transactionId=${id}`).pipe(map((res: any) => res.data));
  }
}
