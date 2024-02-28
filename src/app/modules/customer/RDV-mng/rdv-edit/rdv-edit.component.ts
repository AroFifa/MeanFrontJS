import { Component, Inject, OnInit } from '@angular/core';
import { ShareComponent } from '../../../../shared/Component/ShareComponent';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { RdvService } from '../rdv.service';
import { User } from '../../../../models/User';
import { MatSelectChange } from '@angular/material/select';
import { StaffService } from '../../../admin/Management/staff/staff.service';
import { remainders } from '../rdv-mng/config';

@Component({
    selector: 'app-rdv-edit',
    templateUrl: './rdv-edit.component.html',
})
export class RdvEditComponent extends ShareComponent implements OnInit {
    services: any[];
    staffsService: User[] = [];
    dateTimeField: any;
    remainders = remainders;
    booking: any;

    constructor(
        public matDialogRef: MatDialogRef<RdvEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private bookingService: RdvService,
        private _staffService: StaffService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.services = this.data.services;
        this.booking = this.data.booking;
        this.dateTimeField = this.bookingService.parseDateString(
            this.booking.startDate,
        );
        this.getStaffFromService(this.booking.service);
        this.initForm();
    }

    initForm() {
        this.form = this._formBuilder.group({
            service: [this.booking.service, Validators.required],
            staff: [this.booking.staff, Validators.required],
            remainder: [this.booking.remainder],
        });
    }

    getStaffFromService(serviceId: string) {
        this._staffService
            .getStaffFromService(serviceId)
            .subscribe((data) => (this.staffsService = data.data));
    }

    getStaffs(event: MatSelectChange) {
        this.staffsService = [];
        this.getStaffFromService(event.value);
    }

    addDate(event: any) {
        this.dateTimeField = event.value;
    }

    closeModal() {
        this.matDialogRef.close();
    }

    manageBooking() {
        this.booking = {
            ...this.booking,
            service: this.form.value.service,
            staff: this.form.value.staff,
            remainder: this.form.value.remainder,
            startDate: this.dateTimeField,
        };

        let service = this.services.find(
            (service) => service._id === this.booking.service,
        );
        this.booking.endDate = this.bookingService.getServiceDateEnd(
            this.booking.startDate,
            service.duration,
        );

        this.booking.startDate = this.booking.startDate.toLocaleString();
        this.booking.endDate = this.booking.endDate.toLocaleString();
        this.booking.price = service.price;
    }

    updateBooking() {
        if (this.form.invalid || !this.dateTimeField) return;
        this.manageBooking();

        this.bookingService
            .update(this.booking._id, this.booking)
            .subscribe((data) => {
                if (data.state == 'error') this.alert.type = 'error';
                else {
                    this.alert.type = 'success';
                    this.callback = () => {
                        this.form.reset();
                        this.closeModal();
                    };
                }
                this.alert.message = data.message;
                this.handleMessage();
            });
    }
}
