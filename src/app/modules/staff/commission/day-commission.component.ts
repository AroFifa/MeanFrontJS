import { Component, OnInit } from '@angular/core';
import { WorkHourService } from '../../admin/Management/workhour/workHour.service';
import { WorkHour } from '../../../models/WorkHour';
import { CommonService } from '../../../shared/service/common.service';
import { MatTableDataSource } from '@angular/material/table';
import { BookingService } from 'app/modules/customer/RDV-history/booking.service';

@Component({
    selector: 'app-day-commission',
    templateUrl: './day-commission.component.html',
})
export class DayCommissionComponent implements OnInit {
    dataSource: any;
    displayedColumns: string[] = ['day', 'start', 'end'];

    constructor(
        private _bookingService: BookingService,
    ) {}

    ngOnInit(): void {
        this._bookingService
            .getDayCommission()
            .subscribe(
                (data) =>
                    (this.dataSource = new MatTableDataSource<WorkHour>(
                        data
                    )),
            );
    }
}
