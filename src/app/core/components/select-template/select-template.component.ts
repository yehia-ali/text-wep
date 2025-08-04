import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesService } from '../../services/templates.service';
import { TranslateModule } from '@ngx-translate/core';
import { HttpParams } from '@angular/common/http';
import { SearchComponent } from "../../filters/search.component";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoadingComponent } from "../loading.component";
import { NotFoundComponent } from "../not-found.component";

@Component({
  selector: 'select-template',
  standalone: true,
  imports: [CommonModule, TranslateModule, SearchComponent, LoadingComponent, NotFoundComponent],
  templateUrl: './select-template.component.html',
  styleUrls: ['./select-template.component.scss']
})
export class SelectTemplateComponent {


  language = localStorage.getItem('language')
  TaskGroupType:any = this.data && this.data.TaskGroupType ? this.data.TaskGroupType : null
  searchValue:any
  selectedTemplateFilter = 1
  templatesFilterList = [
    {number:1 , name : 'space_templates'},
    {number:2 , name : 'taskedin_templates'},
  ]
  templates: any[] = [];
  loading = true;
    constructor(private service : TemplatesService,
    public dialogRef: MatDialogRef<SelectTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  ngOnInit(){
    this.getTempates(this.selectedTemplateFilter)
  }

  getTempates(type: any) {
    this.loading = true
    this.selectedTemplateFilter = type
    let params = new HttpParams()
    if(this.searchValue){
      params = params.set('search'  , this.searchValue)
    }
    if(this.TaskGroupType){
      params = params.set('TaskGroupType'  , this.TaskGroupType)
    }
    if(this.selectedTemplateFilter == 1){
      this.service.getSpaceTemplates(params).subscribe((res:any) => {
        this.templates = res.data.items
        this.loading = false
      })
    }else{
      this.service.getGlobalTemplates(params).subscribe((res:any) => {
        this.templates = res.data.items
        this.loading = false
      })
    }
  }

  selecteTemplate(template: any) {
    template.priority = String(template.priority)
    template.taskGroupType = String(template.taskGroupType)
    this.dialogRef.close(template); // إرجاع القالب المحدد إلى الـ Parent Component
  }

  close() {
    this.dialogRef.close();
  }
}
