import { Component, OnInit, ViewChild } from '@angular/core';
import {
    BryntumCalendarComponent,
    BryntumCalendarProjectModelComponent,
} from '@bryntum/calendar-angular';
import { projectConfig } from '../../customer/RDV-mng/rdv-mng/config';
import { MatDialog } from '@angular/material/dialog';
import { RdvService } from '../../customer/RDV-mng/rdv.service';
import { CommonService } from '../../../shared/service/common.service';
import { getCalendarConfig, ressources } from './CalendarConfig';
import { EventStore } from '@bryntum/calendar';
import { ServiceService } from '../../admin/Management/service.service';
import { RdvEditComponent } from '../../customer/RDV-mng/rdv-edit/rdv-edit.component';

@Component({
    selector: 'app-booking',
    templateUrl: './booking.component.html',
})
export class BookingComponent implements OnInit {
    resources = ressources;
    projectConfig = projectConfig;
    userBookings: any[];
    workHours: any[];
    staffId: string;
    calendarConfig: any;
    events: any[] = [];
    services: any[];

    @ViewChild('calendar', { static: true })
    calendarComponent!: BryntumCalendarComponent;
    @ViewChild('project', { static: true })
    projectComponent!: BryntumCalendarProjectModelComponent;

    constructor(
        private _matDialog: MatDialog,
        private _bookingService: RdvService,
        private _commonService: CommonService,
        private _serviceService: ServiceService,
    ) {
        this.openBookingEdit = this.openBookingEdit.bind(this);
        this.calendarConfig = getCalendarConfig(this.openBookingEdit);
    }

    ngOnInit(): void {
        this.staffId = this._commonService.getValue_FromToken('id');
        this._serviceService
            .getAll()
            .subscribe((data) => (this.services = data.data.services.items));
        this.getUserBookings();
    }

    buildUserBooking() {
        let userEvents = [];
        this.userBookings.map((staffBooking) => {
            userEvents.push({
                id: staffBooking._id,
                name: 'Rendez-vous',
                startDate: this._bookingService.parseDateString(
                    staffBooking.startDate,
                ),
                endDate: this._bookingService.parseDateString(
                    staffBooking.endDate,
                ),
                resourceId: 1,
                resizable: false,
            });
        });

        this.addEvents(userEvents);
    }

    getUserBookings() {
        this._bookingService
            .search(null, null, null, { staff: this.staffId, isDone: false })
            .subscribe(async (data) => {
                this.userBookings = data.data;
                this.buildUserBooking();
                await this.getStaffWorkHour();
            });
    }

    addEvents(data: any[]) {
        let eventStore: EventStore = this.calendarComponent.instance.eventStore;

        eventStore.add(data);
        this.calendarComponent.instance.refresh();
    }

    async getStaffWorkHour() {
        let view: any = this.calendarComponent.instance.views[1];
        this.workHours = await this._bookingService.buildStaffWorkHour(
            this.staffId,
            view.lastRangeAnnounced.startDate,
            view.lastRangeAnnounced.endDate,
        );
        this.addEvents(this.workHours);
    }

    removeEvent(data: any[]) {
        let eventStore: EventStore = this.calendarComponent.instance.eventStore;
        data.forEach((staffEvent) => eventStore.remove(staffEvent.id));
        this.calendarComponent.instance.refresh();
    }

    openBookingEdit(eventRecord: any) {
        let booking = this.userBookings.find(
            (booking) => booking._id === eventRecord.data.id,
        );
        this._matDialog
            .open(RdvEditComponent, {
                data: { services: this.services, booking: booking },
            })
            .afterClosed()
            .subscribe((value) => {
                if (value) this.removeEvent([eventRecord.data]);
            });
    }
}
