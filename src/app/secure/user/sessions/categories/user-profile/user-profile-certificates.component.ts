import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialog} from '@angular/material/dialog';
import {UserCertificate} from 'src/app/core/interfaces/user-profile';
import {UserImageComponent} from "../../../../../core/components/user-image.component";
import {environment} from "../../../../../../environments/environment";
import {ArabicDatePipe} from "../../../../../core/pipes/arabic-date.pipe";
import {PublicUserProfileService} from "../../../../../core/services/public-user-profile.service";
import {ConfirmationMessageComponent} from 'src/app/core/dialogs/confirmation-message.component';
import {CertificationFormComponent} from './certification-form.component';

@Component({
  selector: 'user-profile-certificates',
  standalone: true,
  template: `
    <div class="flex aic jcsb">
      <h2 class="lighter fs-18">{{'certificates' | translate}}</h2>
      <button class="clickable-btn fs-18 primary" *ngIf="isCurrentUser" (click)="certificationForm()">{{'add' | translate}}</button>
    </div>

    <div class="certificates mt-1">
      <div class="certificate mb-2 flex aic jcsb" *ngFor="let certificate of certificates">
        <div class="flex aic gap-x-1">
          <user-image [imageUrl]="environment.publicImageUrl" [dim]="35" [rounded]="false" [img]="certificate.imageUrl" type="certificate"/>
          <div class="certificate-info">
            <p class="bold">{{certificate.name}}</p>
            <p class="fs-15">{{certificate.issueOrganizationName}} <span class="fs-14">({{certificate.issueDate | arabicDate:'short'}})</span></p>
          </div>
        </div>
        <div class="flex aic gap-x-2" *ngIf="isCurrentUser">
          <button type="button" class="clickable-btn" [matTooltip]="'edit' | translate" (click)="certificationForm(true, certificate)">
            <img src="assets/images/icons/edit.svg" alt="edit icon">
          </button>
          <button type="button" class="clickable-btn" [matTooltip]="'delete' | translate" (click)="deleteCertificate(certificate.id)">
            <i class='bx bx-x danger fs-28'></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [],
  imports: [CommonModule, UserImageComponent, TranslateModule, MatTooltipModule, UserImageComponent, ArabicDatePipe]
})
export class UserProfileCertificatesComponent {
  @Input() certificates: UserCertificate[] = [];
  @Input() isCurrentUser!: boolean;
  protected readonly environment = environment;

  constructor(private dialog: MatDialog, private service: PublicUserProfileService) {
  }

  certificationForm(isEdit = false, data: UserCertificate | null = null) {
    this.dialog.open(CertificationFormComponent, {
      panelClass: 'large-form-dialog',
      data: {
        isEdit: isEdit,
        data
      }
    });
  }

  deleteCertificate(id: number) {
    let ref = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      data: {
        btn_name: 'confirm',
        message: 'delete_certificate_message',
        classes: 'bg-primary white'
      }
    });
    ref.afterClosed().subscribe(res => {
      if (res) {
        this.service.deleteCertificate(id).subscribe();
      }
    });
  }
}
