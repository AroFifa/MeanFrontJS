import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../../../admin/Management/service.service';
import { User } from '../../../../models/User';
import { ShareComponent } from '../../../../shared/Component/ShareComponent';
import { FormBuilder, Validators } from '@angular/forms';
import {
    BryntumCalendarComponent,
    BryntumCalendarProjectModelComponent,
} from '@bryntum/calendar-angular';
import { calendarConfig, projectConfig } from '../rdv-calendar/config';

@Component({
    selector: 'app-rdv-mng',
    templateUrl: './rdv-mng.component.html',
})
export class RdvMngComponent extends ShareComponent implements OnInit {
    services: any[];
    staffs: User[] = [];
    resources = [
        {
            id: 1,
            name: 'Default Calendar',
            eventColor: 'green',
        },
    ];

    events = [
        {
            id: 1,
            name: 'Travail',
            startDate: '2022-01-01T10:00:00',
            endDate: '2022-01-01T11:00:00',
            resourceId: 1,
        },
    ];

    calendarConfig = calendarConfig;
    projectConfig = projectConfig;

    @ViewChild('calendar') calendarComponent!: BryntumCalendarComponent;
    @ViewChild('project')
    projectComponent!: BryntumCalendarProjectModelComponent;

    constructor(
        private _serviceService: ServiceService,
        private _formBuilder: FormBuilder,
    ) {
        super();
    }

    ngOnInit(): void {
        this.buildForm();
        this._serviceService
            .getAll()
            .subscribe((data) => (this.services = data.data.services.items));
    }

    buildForm() {
        this.form = this._formBuilder.group({
            bookingDate: ['', Validators.required],
            bookingHour: ['', Validators.required],
            services: ['', Validators.required],
            staff: ['', Validators.required],
        });
    }
}
