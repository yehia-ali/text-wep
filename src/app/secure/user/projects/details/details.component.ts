import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from "@angular/router";
import {AlertService} from "../../../../core/services/alert.service";
import {ProjectService} from "../../../../core/servicess/project.service";
import {ProjectDetails} from "../../../../core/interfaces/project-details";
import {LayoutComponent} from "../../../../core/components/layout.component";
import {MagicScrollDirective} from "../../../../core/directives/magic-scroll.directive";
import {TranslateModule} from "@ngx-translate/core";
import {UserImageComponent} from "../../../../core/components/user-image.component";
import {MatMenuModule} from "@angular/material/menu";
import {PriorityComponent} from "../../../../core/components/priority.component";
import {DetailsTimelineComponent} from "../../../../core/components/details-timeline.component";
import {ProjectStatusComponent} from "../../../../core/components/project-status.component";

@Component({
    selector: 'project-details',
    standalone: true,
    imports: [CommonModule, LayoutComponent, MagicScrollDirective, TranslateModule, UserImageComponent, MatMenuModule, PriorityComponent, DetailsTimelineComponent, ProjectStatusComponent],
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
    details!: ProjectDetails;
    data!: any;
    report: any;
    isCreator = false;


    constructor(private service: ProjectService, private route: ActivatedRoute, private alert: AlertService, private elm: ElementRef) {
    }

    ngOnInit(): void {
        this.service.projectDetailsReport.subscribe(res => this.report = res);
        this.getProject();
    }

    getProject() {
        this.service.getProjectDetails(+this.route.snapshot.params['id']).subscribe((res) => {
            this.details = res;
            this.isCreator = +localStorage.getItem('id')! == res.projectCreatorId;
            setTimeout(() => {
                /*   START to set the height of the content - the height of the top section   */
                let topSection = this.elm.nativeElement.querySelector('.project-details .top-section');
                let content = this.elm.nativeElement.querySelector('.project-details .content')!;
                content.style.height = 'calc(100% - ' + topSection.offsetHeight + 'px)';
                /*   END to set the height of the content z- the height of the top section   */
            }, 0)
        })
    }

    changeStatue(projectState: any) {
        const data = {
            id: this.details.id,
            title: this.details.title,
            description: this.details.description,
            definitionOfDone: this.details.definitionOfDone,
            endDate: this.details.endDate,
            priority: this.details.priority,
            projectState
        }
        this.service.editProject(data).subscribe(() => {
            this.alert.showAlert('project_status_changed')
            this.details.projectState = projectState;
        })
    }


    ngOnDestroy() {
        this.service.projectDetailsReport.next({})
    }

}
