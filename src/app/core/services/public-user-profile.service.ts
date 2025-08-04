import {HttpClient} from '@angular/common/http';
import {Injectable, signal} from '@angular/core';
import {environment} from 'src/environments/environment';
import {map} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {AlertService} from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class PublicUserProfileService {

  userProfile = signal<any>({});

  constructor(private http: HttpClient, private dialog: MatDialog, private alert: AlertService) {
  }

  getUserProfile() {
    let url = new URL(`${environment.publicUrl}UserProfile/GetMyProfile`);
    return this.http.get(`${url}`).pipe(map((res: any) => {
      if (res.success) {
        this.userProfile.set(res.data);
        localStorage.setItem('public-user-id', res.data.id)
      }
      return res;
    }));
  }

  updateProfile(data: any) {
    return this.http.put(`${environment.publicUrl}UserProfile/UpdateMyProfile`, data).pipe(map((res: any) => {
      if (res.success) {
        this.recallUserProfile('profile_updated')
      }
    }));
  }

  updateProfilePicture(data: any) {
    this.alert.showAlert('file_uploading', 'bg-primary', 5000000000)
    return this.http.put(`${environment.publicUrl}UserProfile/UpdateMyProfilePicture`, data).pipe(map((res: any) => {
      if (res.success) {
        this.recallUserProfile('profile_picture_updated')
      }
    }));
  }

  addSkill(name: any) {
    return this.http.post(`${environment.publicUrl}UserSkill/Create`, {name}).pipe(map((res: any) => {
      if (res.success) {
        this.recallUserProfile('skill_added')
      }
    }));
  }

  deleteSkill(UserSkillId: number) {
    return this.http.delete(`${environment.publicUrl}UserSkill/Delete?UserSkillId=${UserSkillId}`).pipe(map((res: any) => {
      if (res.success) {
        this.recallUserProfile('skill_deleted')
      }
    }));
  }

  addCertificate(data: any, logo: any) {
    return this.http.post(`${environment.publicUrl}UserCertificate/Create`, data).pipe(map((res: any) => {
      if (res.success) {
        this.uploadFileAfterCreatingCertificate(logo, res.data.id, 'certificate_added')
      }
    }));
  }

  updateCertificate(data: any, logo: any) {
    return this.http.put(`${environment.publicUrl}UserCertificate/UpdateMyCertificate`, data).pipe(map((res: any) => {
      if (res.success) {
        this.uploadFileAfterCreatingCertificate(logo, data.id, 'certificate_updated')
      }
    }));
  }

  uploadCertificateFile(id: number, data: any) {
    this.alert.showAlert('file_uploading', 'bg-primary', 5000000000)
    return this.http.put(`${environment.publicUrl}UserCertificate/UpdateMyCertificatePicture?CertificateId=${id}`, data);
  }

  uploadFileAfterCreatingCertificate(logo: any, id: any, message: string) {
    if (!!logo) {
      this.uploadCertificateFile(id, logo).subscribe(() => {
        this.recallUserProfile(message)
      })
    } else {
      this.recallUserProfile(message)
    }
  }

  deleteCertificate(CertificateId: number) {
    return this.http.delete(`${environment.publicUrl}UserCertificate/Delete?CertificateId=${CertificateId}`).pipe(map((res: any) => {
      if (res.success) {
        this.recallUserProfile('certificate_deleted')
      }
    }));
  }

  addWorkExperience(data: any, logo: any, close = true) {
    return this.http.post(`${environment.publicUrl}UserWorkExperience/Create`, data).pipe(map((res: any) => {
      if (res.success) {
        this.uploadFileAfterCreatingWorkExperience(logo, res.data.id, 'work_experience_added', close)
      }
    }));
  }

  updateWorkExperience(data: any, logo: any, close = true) {
    return this.http.put(`${environment.publicUrl}UserWorkExperience/UpdateMyWorkExperience`, data).pipe(map((res: any) => {
      if (res.success) {
        this.uploadFileAfterCreatingWorkExperience(logo, data.id, 'work_experience_updated', close)
      }
    }));
  }

  uploadFileAfterCreatingWorkExperience(logo: any, id: any, message: string, close: boolean) {
    if (!!logo) {
      this.uploadWorkExperienceFile(id, logo).subscribe(() => {
        this.recallUserProfile(message, close)
      })
    } else {
      this.recallUserProfile(message, close)
    }
  }

  uploadWorkExperienceFile(id: number, data: any) {
    this.alert.showAlert('file_uploading', 'bg-primary', 5000000000)
    return this.http.put(`${environment.publicUrl}UserWorkExperience/UpdateMyWorkExperienceCompanyPicture?UserWorkExperienceId=${id}`, data);
  }

  deleteWorkExperience(UserWorkExperienceId: number) {
    return this.http.delete(`${environment.publicUrl}UserWorkExperience/Delete?UserWorkExperienceId=${UserWorkExperienceId}`).pipe(map((res: any) => {
      if (res.success) {
        this.recallUserProfile('work_experience_deleted')
      }
    }));
  }

  getSubCategories(id: number) {
    let url = new URL(`${environment.publicUrl}ServiceSubCategory/GetAll`);
    url.searchParams.append('serviceCategoryId', id.toString());
    return this.http.get(`${url}`).pipe(map((res: any) => {
      return res.data.items;
    }))
  }

  recallUserProfile(message: string, close = true) {
    if (close) {
      this.dialog.closeAll();
    }
    this.alert.showAlert(message);
    this.getUserProfile().subscribe()
  }

}
