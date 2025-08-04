import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from "../../../../core/components/layout.component";
import {MagicScrollDirective} from "../../../../core/directives/magic-scroll.directive";
import {TranslateModule} from "@ngx-translate/core";
import {MyPayslipService} from "../../../../core/services/my-payslip.service";
import {ArabicNumbersPipe} from "../../../../core/pipes/arabic-numbers.pipe";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {NotFoundComponent} from "../../../../core/components/not-found.component";

@Component({
  selector: 'my-payslip',
  standalone: true,
  imports: [CommonModule, LayoutComponent, MagicScrollDirective, TranslateModule, ArabicNumbersPipe, LoadingComponent, NotFoundComponent],
  templateUrl: './my-payslip.component.html',
  styleUrls: ['./my-payslip.component.scss']
})
export class MyPayslipComponent implements OnInit {
  service = inject(MyPayslipService)
  details: any;
  dir = document.dir;
  progress = 50;
  loading = true;
  totalDeductions :any
  ngOnInit() {
    this.details = this.service.getDetails().subscribe(res => {
      if (res) {
        this.details = res;
        this.progress = this.details.totalDeductions / this.details.gross * 100;
        this.totalDeductions = this.details.totalDeductions + this.details.taxes
        this.loading = false;
      } else {
        this.loading = false;
      }
    })
  }
}
