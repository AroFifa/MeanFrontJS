import { Injectable } from '@angular/core';
import { CRUDService } from '../../../shared/service/CRUDService';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../../shared/service/common.service';
import { environment } from '../../../environments/environment';
import { WorkHourService } from '../../admin/Management/workhour/workHour.service';

@Injectable({
    providedIn: 'root',
})
export class RdvService extends CRUDService {
    constructor(
        private http: HttpClient,
        private _commonService: CommonService,
        private _workHourService: WorkHourService,
    ) {
        super(http);
        this.baseUrl = 'bookings';
    }

    getUserBookings() {
        let userId = this._commonService.getValue_FromToken('id');
        return this._http.get<any>(
            `${environment.URL_API}/${this.baseUrl}/users/${userId}`,
        );
    }

    getServiceDateEnd(date: string, duration: number) {
        let end = new Date(date);
        end.setMinutes(end.getMinutes() + duration);
        return end;
    }

    parseDateString(dateString: string): Date {
        const parts = dateString.split(/[\s/:]/);
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-indexed
        const year = parseInt(parts[2], 10);
        const hours = parseInt(parts[3], 10);
        const minutes = parseInt(parts[4], 10);
        const seconds = parseInt(parts[5], 10);

        return new Date(year, month, day, hours, minutes, seconds);
    }

    isBetween(start1: Date, end1: Date, start2: Date, end2: Date) {
        return start1 <= start2 && end2 <= end1;
    }

    isInside(start1: Date, end1: Date, start2: Date, end2: Date) {
        return (
            this.isBetween(start1, end1, start2, end2) ||
            (start1 <= start2 && start2 <= end1) ||
            (start1 <= end2 && end2 <= end1)
        );
    }

    ifAlreadyTaken(booking: any, staffBookings: any[]) {
        return staffBookings.some((staffBooking) => {
            let start1 = this.parseDateString(staffBooking.startDate);
            let end1 = this.parseDateString(staffBooking.endDate);
            let start2 = this.parseDateString(booking.startDate);
            let end2 = this.parseDateString(booking.endDate);
            return (
                this.isInside(start1, end1, start2, end2) ||
                this.isInside(start2, end2, start1, end1)
            );
        });
    }

    buildDateWithHour(date: Date, stringHour: string) {
        let [hour, minute] = stringHour
            .split(':')
            .map((num) => parseInt(num, 10));

        date.setHours(hour, minute);
        return date;
    }

    async getStaffWorkHour(filter: any) {
        return await new Promise((res, rej) => {
            this._workHourService
                .search(null, null, null, filter)
                .subscribe((data) => {
                    res(data.data ?? []);
                });
        });
    }

    async insideWorkHour(booking: any) {
        let date = this.parseDateString(booking.startDate);
        let dow = date.getDay();

        if (dow === 7) return false;

        let workHours: any = await this.getStaffWorkHour({
            employees: [booking.staff],
            isDeleted: false,
            dow: dow,
        });

        if (workHours.length == 0) return false;

        let bookingStart = this.parseDateString(booking.startDate);
        let bookingEnd = this.parseDateString(booking.endDate);

        let workStart = this.buildDateWithHour(
            this.parseDateString(booking.startDate),
            workHours[0].start,
        );

        let workEnd = this.buildDateWithHour(
            this.parseDateString(booking.startDate),
            workHours[0].end,
        );

        return this.isBetween(workStart, workEnd, bookingStart, bookingEnd);
    }

    async buildStaffWorkHour(staffId: string, startDate: Date, endDate: Date) {
        let dateArray = [];

        let workHours: any = await this.getStaffWorkHour({
            employees: [staffId],
            isDeleted: false,
        });

        if (workHours.length === 0) return [];

        let currentDate = this.parseDateString(startDate.toLocaleString());

        while (currentDate <= endDate) {
            let dow = currentDate.getDay();
            let workHour = workHours.find(
                (workHour: any) => workHour.dow === dow,
            );
            if (workHour) {
                let event = {
                    id: workHour._id,
                    name: 'Heure de travail',
                    startDate: this.buildDateWithHour(
                        new Date(currentDate),
                        workHour.start,
                    ),
                    endDate: this.buildDateWithHour(
                        new Date(currentDate),
                        workHour.end,
                    ),
                    resourceId: 3,
                };

                dateArray.push(event);
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dateArray;
    }
}
