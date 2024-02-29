import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../../../admin/Management/service.service';
import { User } from '../../../../models/User';
import { ShareComponent } from '../../../../shared/Component/ShareComponent';
import { FormBuilder, Validators } from '@angular/forms';
import {
    BryntumCalendarComponent,
    BryntumCalendarProjectModelComponent,
} from '@bryntum/calendar-angular';
import {
    getCalendarConfig,
    projectConfig,
    remainders,
    ressources,
} from './config';
import { MatSelectChange } from '@angular/material/select';
import { StaffService } from '../../../admin/Management/staff/staff.service';
import { ActivatedRoute } from '@angular/router';
import { CalendarConfig, EventStore } from '@bryntum/calendar';
import { RdvService } from '../rdv.service';
import { CommonService } from '../../../../shared/service/common.service';
import { MatDialog } from '@angular/material/dialog';
import { RdvEditComponent } from '../rdv-edit/rdv-edit.component';
import { ConfirmationComponent } from '../../../Common/confirmation/confirmation.component';

@Component({
    selector: 'app-rdv-mng',
    templateUrl: './rdv-mng.component.html',
})
export class RdvMngComponent extends ShareComponent implements OnInit {
    services: any[];
    staffsService: User[] = [];
    staffBookings: any[];
    userBookings: any[];
    staffEvents: any[] = [];
    staffWorkHours: any[] = [];
    resources = ressources;
    events = [];
    calendarConfig: any;
    projectConfig = projectConfig;
    remainders = remainders;

    @ViewChild('calendar', { static: true })
    calendarComponent!: BryntumCalendarComponent;
    @ViewChild('project', { static: true })
    projectComponent!: BryntumCalendarProjectModelComponent;
    dateTimeField: any;
    price: number = 0;

    constructor(
        private route: ActivatedRoute,
        private _serviceService: ServiceService,
        private _bookingService: RdvService,
        private _formBuilder: FormBuilder,
        private _staffService: StaffService,
        private _commonService: CommonService,
        private _matDialog: MatDialog,
    ) {
        super();
        this.updateBooking = this.updateBooking.bind(this);
        this.deleteConfirmation = this.deleteConfirmation.bind(this);
        this.acceptDrag = this.acceptDrag.bind(this);
        this.calendarConfig = getCalendarConfig(
            this.updateBooking,
            this.deleteConfirmation,
            this.acceptDrag,
        );
    }

    ngOnInit(): void {
        this.buildForm();
        this.services =
            this.route.snapshot.data['data'][0].data?.services.items;
        this.buildEvents(this.route.snapshot.data['data'][1].data);
    }

    buildEvents(userBooking: any[]) {
        this.userBookings = userBooking;
        this.events = this.userBookings.map((userBooking: any) => {
            return {
                id: userBooking._id,
                name: this.getService(userBooking.service).name,
                startDate: userBooking.startDate,
                endDate: userBooking.endDate,
                resourceId: 1,
            };
        });
    }

    buildForm() {
        this.form = this._formBuilder.group({
            service: ['', Validators.required],
            staff: ['', Validators.required],
            remainder: [''],
        });
    }

    addValue(event: any) {
        this.dateTimeField = event.value;
    }

    async getStaffs(event: MatSelectChange) {
        let service = this.getService(event.value);
        this.price = service.price;
        this.staffsService = [];

        this._staffService
            .getStaffFromService(event.value)
            .subscribe((data) => (this.staffsService = data.data));
    }

    getService(serviceId: string) {
        return this.services.find((service) => service._id === serviceId);
    }

    removeEvent(data: any[]) {
        let eventStore: EventStore = this.calendarComponent.instance.eventStore;
        data.forEach((staffEvent) => eventStore.remove(staffEvent.id));
        this.calendarComponent.instance.refresh();
    }

    addStaffEvents() {
        let staffBookings = this.staffBookings.filter((staffBooking) => {
            let result = this.userBookings.find(
                (userBooking) => userBooking._id === staffBooking._id,
            );
            return !result;
        });

        this.removeEvent(this.staffEvents);
        this.staffEvents = [];
        staffBookings.map((staffBooking) => {
            this.staffEvents.push({
                id: staffBooking._id,
                name: 'Autres Rendez-vous',
                startDate: this._bookingService.parseDateString(
                    staffBooking.startDate,
                ),
                endDate: this._bookingService.parseDateString(
                    staffBooking.endDate,
                ),
                resourceId: 2,
                resizable: false,
            });
        });

        let eventStore: EventStore = this.calendarComponent.instance.eventStore;

        eventStore.add(this.staffEvents);
        this.calendarComponent.instance.refresh();
    }

    addNewEvent(data: any, service: any) {
        let newBooking = data;
        let eventStore: EventStore = this.calendarComponent.instance.eventStore;
        eventStore.add({
            id: newBooking._id,
            name: service.name,
            startDate: newBooking.startDate,
            endDate: newBooking.endDate,
            resourceId: 1,
            resizable: false,
        });

        this.initData();
        this.calendarComponent.instance.refresh();
    }

    addBooking(booking: any, service: any) {
        this._bookingService.create(booking).subscribe((data) => {
            if (data.state == 'error') this.alert.type = 'error';
            else {
                this.alert.type = 'success';
                this.callback = () => {
                    this.form.reset();
                    this.addNewEvent(data.data, service);
                };
            }
            this.alert.message = data.message;
            this.handleMessage();
        });
    }

    initData() {
        this.form.reset();
        this.price = 0;
    }

    syncData() {
        this._bookingService.getUserBookings().subscribe((data) => {
            this.buildEvents(data.data);
        });
    }

    async getStaffBookings(event: MatSelectChange) {
        this.removeEvent(this.staffWorkHours);
        this.staffWorkHours = [];

        let view: any = this.calendarComponent.instance.views[1];

        this.staffWorkHours = await this._bookingService.buildStaffWorkHour(
            event.value,
            view.lastRangeAnnounced.startDate,
            view.lastRangeAnnounced.endDate,
        );
        let eventStore: EventStore = this.calendarComponent.instance.eventStore;
        eventStore.add(this.staffWorkHours);
        this.calendarComponent.instance.refresh();

        this._bookingService.getStaffBookings(event.value).subscribe((data) => {
            this.staffBookings = data.data;
            this.addStaffEvents();
        });
    }

    showMessage(type: 'error' | 'success', message: string) {
        this.showAlert = true;
        this.alert.type = type;
        this.alert.message = message;
        setInterval(() => {
            this.showAlert = false;
        }, 5000);
    }

    manageBooking(duration: number) {
        let booking = {
            ...this.form.value,
            startDate: this.dateTimeField,
        };

        booking.endDate = this._bookingService.getServiceDateEnd(
            booking.startDate,
            duration,
        );

        booking.price = this.price;
        booking.lastRemainder = new Date().toLocaleString();
        booking.startDate = booking.startDate.toLocaleString();
        booking.endDate = booking.endDate.toLocaleString();
        booking.user = this._commonService.getValue_FromToken('id');

        return booking;
    }

    async makeBooking() {
        if (this.form.invalid || !this.dateTimeField) return;
        let booking = {
            ...this.form.value,
            startDate: this.dateTimeField,
        };
        let service = this.getService(booking.service);
        booking = this.manageBooking(service.duration);

        let isTaken = this._bookingService.ifAlreadyTaken(
            booking,
            this.staffBookings,
        );

        if (isTaken)
            this.showMessage('error', 'Veuillez choisir une heure valide');

        let value = await this._bookingService.insideWorkHour(booking);
        if (!value)
            this.showMessage('error', 'Rendez-vous hors des heures de travail');

        this.addBooking(booking, service);
    }

    updateBooking(eventRecord: any) {
        let booking = this.userBookings.find(
            (booking) => booking._id === eventRecord.data.id,
        );
        this._matDialog
            .open(RdvEditComponent, {
                data: {
                    services: this.services,
                    booking: booking,
                },
            })
            .afterClosed()
            .subscribe(() => this.syncData());
    }

    deleteConfirmation(bookingId: string) {
        this._matDialog
            .open(ConfirmationComponent, {
                data: {
                    type: 'delete',
                    message: 'Voulez vous supprimez ce rendez-vous ? ',
                },
            })
            .afterClosed()
            .subscribe((response) => {
                if (response) {
                    this._bookingService
                        .delete(bookingId)
                        .subscribe(() => this.syncData());
                }
            });
    }

    async acceptDrag(id: string, startDate: any, endDate: any) {
        return await new Promise((res, rej) => {
            this._matDialog
                .open(ConfirmationComponent, {
                    data: {
                        type: 'Info',
                        message: `Voulez vous reporter votre rendez-vous le  ${startDate.toLocaleString()} ?`,
                    },
                })
                .afterClosed()
                .subscribe((response) => {
                    if (response) this.modifyByDragging(id, startDate, endDate);
                    res(response);
                });
        });
    }

    modifyByDragging(id: string, startDate: string, endDate: string) {
        let updateField = {
            startDate: startDate.toLocaleString(),
            endDate: endDate.toLocaleString(),
        };

        this._bookingService
            .update(id, updateField)
            .subscribe((data) => this.syncData());
    }
}
