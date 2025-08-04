import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {UserImageComponent} from "../user-image.component";
import {WalletService} from "../../services/wallet.service";
import {ArabicNumbersPipe} from "../../pipes/arabic-numbers.pipe";
import {ArabicDatePipe} from "../../pipes/arabic-date.pipe";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'success-message',
  standalone: true,
  imports: [CommonModule, TranslateModule, UserImageComponent, MatDialogModule, ArabicNumbersPipe, ArabicDatePipe],
  templateUrl: './success-message.component.html',
  styleUrls: ['./success-message.component.scss']
})
export class SuccessMessageComponent implements OnInit {
  data: any;
  print = false;
  pdf: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data_: any, private dialog: MatDialog, public walletSer: WalletService) {
    this.data = data_.data;
  }

  ngOnInit(): void {
    // this.walletSer.getPdf(this.data.transactionId).subscribe(res => this.pdf = res)
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  callPrint() {
    this.print = true;
    setTimeout(() => {
      window.print();
      this.print = false;
    }, 10);
  }

  protected readonly environment = environment;
}
