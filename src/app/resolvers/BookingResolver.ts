import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { StaffService } from '../modules/admin/Management/staff/staff.service';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ServiceService } from '../modules/admin/Management/service.service';
import { RdvService } from '../modules/customer/RDV-mng/rdv.service';
import { WorkHourService } from '../modules/admin/Management/workhour/workHour.service';

@Injectable({
    providedIn: 'root',
})
export class BookingResolver implements Resolve<any> {
    constructor(
        private _serviceService: ServiceService,
        private _bookingService: RdvService,
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return forkJoin([
            this._serviceService.getAll(),
            this._bookingService.getUserBookings(),
        ]);
    }
}
