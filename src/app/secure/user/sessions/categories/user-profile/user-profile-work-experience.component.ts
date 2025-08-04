import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialog} from '@angular/material/dialog';
import {UserWorkExperience} from 'src/app/core/interfaces/user-profile';
import {UserImageComponent} from "../../../../../core/components/user-image.component";
import {environment} from "../../../../../../environments/environment";
import {ArabicDatePipe} from "../../../../../core/pipes/arabic-date.pipe";
import {PublicUserProfileService} from "../../../../../core/services/public-user-profile.service";
import {ConfirmationMessageComponent} from "../../../../../core/dialogs/confirmation-message.component";
import {WorkExperienceFormComponent} from "./work-experience-form.component";


@Component({
  selector: 'user-profile-work-experience',
  standalone: true,
  template: `
    <div class="flex aic jcsb mb-1">
      <h2 class="lighter fs-18">{{'work_experience' | translate}}</h2>
      <button class="clickable-btn fs-18 primary" *ngIf="isCurrentUser" (click)="workExperienceForm()">{{'add' | translate}}</button>
    </div>
    <div class="work-experience mb-2 flex aic jcsb" *ngFor="let item of experience">
      <div class="flex aic gap-x-1">
        <user-image [imageUrl]="environment.publicImageUrl" [dim]="35" [img]="item.companyImageUrl" type="work" [rounded]="false"/>
        <div class="work-experience-info">
          <p class="bold">{{item.jobTitle}}</p>
          <p class="fs-15">{{item.companyName}} ({{item.startDate | arabicDate}} - <span *ngIf="!item.isPresent">{{item.endDate | arabicDate}})</span> <span
            *ngIf="item.isPresent">{{'present' | translate}})</span></p>
        </div>
      </div>
      <div class="flex aic gap-x-1" *ngIf="isCurrentUser">
        <button type="button" class="clickable-btn" [matTooltip]="'edit' | translate" (click)="workExperienceForm(true, item)">
          <img src="assets/images/icons/edit.svg" alt="edit icon">
        </button>
        <button type="button" class="clickable-btn" [matTooltip]="'delete' | translate" (click)="deleteWorkExperience(item.id)">
          <i class='bx bx-x danger fs-28'></i>
        </button>
      </div>
    </div>
  `,
  styles: [],
  imports: [CommonModule, UserImageComponent, TranslateModule, MatTooltipModule, UserImageComponent, ArabicDatePipe]
})
export class UserProfileWorkExperienceComponent {
  @Input() experience: UserWorkExperience[] = [];
  @Input() isCurrentUser = true;
  protected readonly environment = environment;

  constructor(private dialog: MatDialog, private service: PublicUserProfileService) {
  }

  workExperienceForm(isEdit = false, data: UserWorkExperience | null = null) {
    this.dialog.open(WorkExperienceFormComponent, {
      panelClass: 'large-form-dialog',
      data: {
        isEdit: isEdit,
        data
      }
    })
  }

  deleteWorkExperience(id: number) {
    let ref = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      data: {
        btn_name: 'confirm',
        message: 'delete_work_experience_message',
        classes: 'bg-primary white'
      }
    });
    ref.afterClosed().subscribe(res => {
      if (res) {
        this.service.deleteWorkExperience(id).subscribe()
      }
    })
  }
}
