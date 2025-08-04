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
import { PlacesListFormComponent } from "../../../../../core/filters/places-form.component";
import { UserWithImageComponent } from "../../../../../core/components/user-with-image/user-with-image.component";
import { SelectUserComponent } from "../../../../../core/components/select-user.component";

@Component({
  selector: 'places-list',
  standalone: true,
  imports: [CommonModule, LoadingComponent, NotFoundComponent, TranslateModule, ArabicDatePipe, SearchComponent, MatDialogModule, FormsModule, ReactiveFormsModule, InputLabelComponent, InputErrorComponent, MapsComponent, SpaceUsersFormComponent, PlacesListFormComponent, UserWithImageComponent, SelectUserComponent],
  templateUrl: './places-list.component.html',
  styleUrls: ['./places-list.component.scss']
})
export class PlacesListComponent {
  form:FormGroup
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  @ViewChild('dialogPlaceTemplate') dialogPlaceTemplate!: TemplateRef<any>;
  places: any = [];
  loading = false;
  lat: any
  long: any
  radius: any
  searchValue: any;
  update: boolean;
  formData: any;
  placeId: any;
  placeUsers: any[] = [];
  selectedUsers: any[] =[];
  PlaceDialogStatus: boolean;
  constructor(private dialog: MatDialog ,private service :HrEmployeesService , private fb :FormBuilder , private alert : AlertService){}

  ngOnInit() {
    this.getAllPlaces()
    this.form = this.fb.group({
      placeCode:  ['' , Validators.required],
      parentId:   [null],
      managerId:  [null],
      nameAr:     ['' , Validators.required],
      nameEn:     ['' , Validators.required],
      lat:        [0 , Validators.required],
      long:       [0 , Validators.required],
      range:      [0 , Validators.required],
    })
  }

  getAllPlaces(){
    this.loading = true
    let params = new HttpParams()

    if(this.searchValue){
      params = params.set('search' , this.searchValue)
    }

    this.service.getAllPlaces(params).subscribe((res: any) => {
      this.places = res.items;
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
        this.placeId = update.id
    }else{
      this.update = false
    }
  }
  openPlaceDialog(item:any) {
    this.PlaceDialogStatus = false
    setTimeout(() => {
      this.PlaceDialogStatus = true
    }, 0);
    this.dialog.open(this.dialogPlaceTemplate,{
      width:'800px',
    });
    this.placeId = item.id
    this.getPlaceUsers()
  }

  getPlaceUsers(){
    let data = new HttpParams().set('Places' , this.placeId).set('isActive' , true)
    this.service.getUsers(data).subscribe((res:any) => {
      this.placeUsers = res.data.items
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
    this.getAllPlaces()
  }

  addPlace() {
    this.form.value.lat = this.lat
    this.form.value.long = this.long
    this.form.value.range = this.radius

    if(this.form.valid){
      if(this.update){
        let data = {
          ...this.form.value,
          id:this.placeId
        }
        this.service.updatePlace(data).subscribe((res:any) => {
          if(res.success){
            this.alert.showAlert('success');
            this.getAllPlaces()
            this.closeDialog()
          }
        })
      }else{
        this.service.createPlace(this.form.value).subscribe((res:any) => {
          if(res.success){
            this.alert.showAlert('success');
            this.getAllPlaces()
            this.closeDialog()
          }
        })
      }
    }else{
      this.form.markAllAsTouched()
      this.alert.showAlert('error' , 'bg-danger');
    }
  }

  addPlaceUsers(){
    this.loading = true
    let data = {
      usersId:this.selectedUsers,
      placeId:this.placeId
    }
    this.service.addUserToPlace(data).subscribe((res:any) => {
      this.loading = false
      if(res.success){
        this.alert.showAlert('success')
        this.getPlaceUsers()
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
