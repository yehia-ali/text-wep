import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreateFileComponent } from '../forms-component/create-file/create-file.component';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { NotFoundComponent } from "../../../../../core/components/not-found.component";
import { LoadingComponent } from "../../../../../core/components/loading.component";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'files',
  templateUrl: './files.component.html',
  standalone:true,
  styleUrls: ['./files.component.scss'],
  imports: [TranslateModule, CommonModule, NotFoundComponent, LoadingComponent]
})
export class FilesComponentComponent {
  files:any
  spaceId = localStorage.getItem('space-id')
  imageUrl = environment.imageUrl + `Companies/${this.spaceId}/Attachments/` //new URL
  // imageUrl = environment.imageUrl + `EmployeeFiles/` //old URL
  isAdmin: boolean;
  fileName: string;
  company: any;
  selectedUser: any;
  loading = false;

  constructor(private dialog: MatDialog , private service: HrEmployeesService){}

  ngOnInit(){
    this.getFiles()
  }
  getFiles(){
    let storedUser: any = localStorage.getItem('selectedUser');
    let convertedUser = JSON.parse(storedUser);
    this.selectedUser = convertedUser.id;
    this.service.getUserFiles(convertedUser.id).subscribe((res: any) => {
      this.files = res.data
    });
  }
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileName = input.files[0].name;
    }
  }

  createFile(file:any){
    const dialogRef = this.dialog.open(CreateFileComponent, {
      width: '800px',
      data: file
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getFiles(); // Refresh the file list after the dialog is closed
      }
    });

  }
}
