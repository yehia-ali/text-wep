import {Component, TemplateRef, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoadingComponent} from "../../../../../core/components/loading.component";
import {NotFoundComponent} from "../../../../../core/components/not-found.component";
import {TranslateModule} from "@ngx-translate/core";
import {ArabicDatePipe} from "../../../../../core/pipes/arabic-date.pipe";
import { SearchComponent } from "../../../../../core/filters/search.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputLabelComponent } from "../../../../../core/inputs/input-label.component";
import { InputErrorComponent } from "../../../../../core/inputs/input-error.component";
import { AlertService } from 'src/app/core/services/alert.service';
import { MapsComponent } from "../../../../../core/components/maps/maps.component";
import { SpaceUsersFormComponent } from "../../../../../core/filters/space-users-form.component";
import { UserWithImageComponent } from "../../../../../core/components/user-with-image/user-with-image.component";
import { SelectUserComponent } from "../../../../../core/components/select-user.component";
import { LevelsListFormComponent } from "../../../../../core/filters/levels-form.component";

@Component({
  selector: 'levels-list',
  standalone: true,
  imports: [CommonModule, LoadingComponent, NotFoundComponent, TranslateModule, ArabicDatePipe, SearchComponent, MatDialogModule, FormsModule, ReactiveFormsModule, InputLabelComponent, InputErrorComponent, MapsComponent, SpaceUsersFormComponent, UserWithImageComponent, SelectUserComponent, LevelsListFormComponent],
  templateUrl: './levels-list.component.html',
  styleUrls: ['./levels-list.component.scss']
})
export class LevelsListComponent {
  form:FormGroup
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  @ViewChild('dialogLevelTemplate') dialogLevelTemplate!: TemplateRef<any>;
  levels: any = [];
  loading = false;
  lat: any
  long: any
  radius: any
  searchValue: any;
  update: boolean;
  formData: any;
  levelId: any;
  levelUsers: any[] = [];
  selectedUsers: any[] =[];
  LevelDialogStatus: boolean;
  constructor(private dialog: MatDialog ,private service :HrEmployeesService , private fb :FormBuilder , private alert : AlertService){}

  ngOnInit() {
    this.getAllLevels()
    this.form = this.fb.group({
      levelCode:  ['' , Validators.required],
      parentId:   [null],
      managerId:  [null],
      nameAr:     ['' , Validators.required],
      nameEn:     ['' , Validators.required],
      lat:        [0 , Validators.required],
      long:       [0 , Validators.required],
      range:      [0 , Validators.required],
    })
  }

  getAllLevels(){
    this.loading = true
    let params = new HttpParams()

    if(this.searchValue){
      params = params.set('search' , this.searchValue)
    }

    this.service.getAllLevels(params).subscribe((res: any) => {
      this.levels = res.items;
      this.loading = false;
    });
  }

  openDialog(update?:any) {
    this.dialog.open(this.dialogTemplate,{
      width:'800px',
    });
    if(update){
      this.update = true
      this.form.patchValue({
        ...update
      })
        this.levelId = update.id
    }else{
      this.update = false
    }
  }
  openLevelDialog(item:any) {
    this.LevelDialogStatus = false
    setTimeout(() => {
      this.LevelDialogStatus = true
    }, 0);
    this.dialog.open(this.dialogLevelTemplate,{
      width:'800px',
    });
    this.levelId = item.id
    this.getLevelUsers()
  }

  getLevelUsers(){
    let data = new HttpParams().set('Levels' , this.levelId).set('isActive' , true)
    this.service.getUsers(data).subscribe((res:any) => {
      this.levelUsers = res.data.items
    })
  }

  closeDialog() {
    this.dialog.closeAll();
  }
  get f() {
    return this.form.controls;
  }

  search($event: any) {
    this.searchValue = $event
    this.getAllLevels()
  }

  addLevel() {
    this.form.value.lat = this.lat
    this.form.value.long = this.long
    this.form.value.range = this.radius

    if(this.form.valid){
      if(this.update){
        let data = {
          ...this.form.value,
          id:this.levelId
        }
        this.service.updateLevel(data).subscribe((res:any) => {
          if(res.success){
            this.alert.showAlert('success');
            this.getAllLevels()
            this.closeDialog()
          }
        })
      }else{
        this.service.createLevel(this.form.value).subscribe((res:any) => {
          if(res.success){
            this.alert.showAlert('success');
            this.getAllLevels()
            this.closeDialog()
          }
        })
      }
    }else{
      this.form.markAllAsTouched()
      this.alert.showAlert('error' , 'bg-danger');
    }
  }

  addLevelUsers(){
    this.loading = true
    let data = {
      usersId:this.selectedUsers,
      levelId:this.levelId
    }
    this.service.addUserToLevel(data).subscribe((res:any) => {
      this.loading = false
      if(res.success){
        this.alert.showAlert('success')
        this.getLevelUsers()
      }
    })
  }

  getUsers($event: any) {
    $event.forEach((user:any) => {
      this.selectedUsers.push(user.id)
    });
  }

  getMapData(event: any) {
    this.lat = event.lat
    this.long = event.long
    this.radius = event.radius
  }

}
