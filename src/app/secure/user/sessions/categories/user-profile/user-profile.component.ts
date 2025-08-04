import {Component, computed, signal, Signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserProfile} from "../../../../../core/interfaces/user-profile";
import {MatDialog} from "@angular/material/dialog";
import {ServiceProvidersService} from "../../../../../core/services/service-providers.service";
import {ActivatedRoute} from "@angular/router";
import {UserImageComponent} from "../../../../../core/components/user-image.component";
import {LayoutComponent} from "../../../../../core/components/layout.component";
import {MagicScrollDirective} from "../../../../../core/directives/magic-scroll.directive";
import {environment} from "../../../../../../environments/environment";
import {MatTooltipModule} from "@angular/material/tooltip";
import {TranslateModule} from "@ngx-translate/core";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import {UserProfileSideMenuComponent} from "./user-profile-side-menu.component";
import {UserProfileSummaryComponent} from "./user-profile-summary.component";
import {UserProfileCertificatesComponent} from "./user-profile-certificates.component";
import {UserProfileWorkExperienceComponent} from "./user-profile-work-experience.component";
import {UserProfileSkillsComponent} from "./user-profile-skills.component";
import {PublicUserProfileService} from "../../../../../core/services/public-user-profile.service";
import {EditProfileComponent} from './edit-profile/edit-profile.component';
import {UploadImageModule} from "../../../../../core/components/upload-image/upload-image.module";
import {AlertService} from "../../../../../core/services/alert.service";

@Component({
  selector: 'user-profile',
  standalone: true,
  imports: [CommonModule, UserImageComponent, LayoutComponent, MagicScrollDirective, MatTooltipModule, TranslateModule, MatSlideToggleModule, FormsModule, UserProfileSideMenuComponent, UserProfileSummaryComponent, UserProfileCertificatesComponent, UserProfileWorkExperienceComponent, UserProfileSkillsComponent, UploadImageModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  isCurrentUser = true;
  // the initial value of userProfile is the current user profile
  userProfile: Signal<UserProfile | any> = signal({});
  protected readonly environment = environment;

  constructor(private dialog: MatDialog, private userProfileSer: PublicUserProfileService, private ServiceProviderSer: ServiceProvidersService, private route: ActivatedRoute, private alert: AlertService) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      if (!params['user-id']) {
        this.isCurrentUser = true;
      } else {
        this.isCurrentUser = params['user-id'] == localStorage.getItem('public-user-id');
      }
      if (this.isCurrentUser) {
        this.userProfile = computed(() => this.userProfileSer.userProfile())
      } else {
        this.ServiceProviderSer.getServiceProvider(params['user-id']).subscribe(() => {
          this.userProfile = computed(() => this.ServiceProviderSer.serviceProvider());
        });
      }
    });
  }

  updateImage($event: any) {
    let formData = new FormData();
    formData.append('uploadedFile', $event);
    this.userProfileSer.updateProfilePicture(formData).subscribe();
  }

  editProfile() {
    this.dialog.open(EditProfileComponent, {
      panelClass: 'large-form-dialog'
    })
  }

  isPublicChange($event: any) {
    let data = {
      ...this.userProfile(),
      isPublic: $event
    }
    this.userProfileSer.updateProfile(data).subscribe();
  }
}
