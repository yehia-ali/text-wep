import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserNavbarComponent } from '../../../core/components/user-navbar/user-navbar.component';
import { LayoutComponent } from '../../../core/components/layout.component';
import { LoadingComponent } from '../../../core/components/loading.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NotFoundComponent } from '../../../core/components/not-found.component';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MagicScrollDirective } from '../../../core/directives/magic-scroll.directive';
import { LayoutService } from '../../../core/services/layout.service';
import { MatDialog } from '@angular/material/dialog';
import { ResetAccountService } from 'src/app/core/services/super-admin/reset-account.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'videos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UserNavbarComponent,
    LayoutComponent,
    LoadingComponent,
    NgxPaginationModule,
    NotFoundComponent,
    RouterLink,
    TranslateModule,
    MagicScrollDirective,
  ],
  templateUrl: './reset-account.component.html',
  styleUrls: ['./reset-account.component.scss'],
})
export class ResetAccountComponent implements OnInit {
  service = inject(ResetAccountService);
  layoutSer = inject(LayoutService);
  dialog = inject(MatDialog);
  videos: any;
  loading = true;
  phoneNumber: any;
  newPassword: any;
  constructor(private alert: AlertService) {}
  ngOnInit() {
    this.layoutSer.withSubMenu.next(false);
  }
  resetPassword() {
    this.service
      .resetPassowrd(this.phoneNumber, this.newPassword)
      .subscribe((res: any) => {
        console.log(res);
        if (res.success) {
          this.alert.showAlert('password_changed');
        }
      });
  }

  resetItoCount() {
    this.service.resetOtpCount(this.phoneNumber).subscribe((res: any) => {
      console.log(res);
      if (res.success) {
        this.alert.showAlert('reset_Otp_count');
      }
    });
  }
}
