import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {UserSkill} from 'src/app/core/interfaces/user-profile';
import {MatDialog} from '@angular/material/dialog';
import {PublicUserProfileService} from "../../../../../core/services/public-user-profile.service";
import {ConfirmationMessageComponent} from 'src/app/core/dialogs/confirmation-message.component';
import {SkillsFormComponent} from 'src/app/core/components/skills-form.component';

@Component({
  selector: 'user-profile-skills',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatTooltipModule],
  template: `
    <div class="flex aic jcsb">
      <h2 class="lighter fs-18">{{'skills' | translate}}</h2>
      <button class="clickable-btn fs-18 primary" *ngIf="isCurrentUser" (click)="skillForm()">{{'add' | translate}}</button>
    </div>

    <div class="skills flex aic gap-x-1 gap-y-2 flex-wrap mt-1">
      <div class="skill bg-gray px-1 py-50 rounded-5 flex aic gap-x-1" *ngFor="let skill of skills">
        <p>{{skill.name}}</p>
        <button type="button" class="clickable-btn" [matTooltip]="'delete' | translate" (click)="deleteSkill(skill.id)" *ngIf="isCurrentUser">
            <i class='bx bx-x danger fs-20'></i>
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class UserProfileSkillsComponent {
  @Input() skills!: UserSkill[];
  @Input() isCurrentUser = true;


  constructor(private service: PublicUserProfileService, private dialog: MatDialog) {
  }

  skillForm() {
    this.dialog.open(SkillsFormComponent, {
      panelClass: 'large-form-dialog'
    });
  }

  deleteSkill(id: number) {
    let ref = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      data: {
        btn_name: 'confirm',
        classes: 'bg-primary white',
        message: 'delete_skill_message'
      }
    });
    ref.afterClosed().subscribe(res => {
      if (res) {
        this.service.deleteSkill(id).subscribe();
      }
    });
  }

}
