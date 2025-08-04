import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private snackbar: MatSnackBar, private translate: TranslateService) {
  }

  showAlert(message: string, type = 'bg-success', duration = 3000) {
    if (type == 'bg-success') {
      this.snackbar.open(this.translate.instant(message) + ' 🎉🎊', '', {
        duration,
        panelClass: type
      });
    } else if (type == 'bg-primary') {
      this.snackbar.open(this.translate.instant(message), '', {
        duration: duration,
        panelClass: type
      });
    }
    else {
      if(message){
        this.snackbar.open(this.translate.instant(message), '', {
          duration: 5000,
          panelClass: type
        });
      }
    }
  }
}
