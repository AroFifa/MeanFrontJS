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

import { BookingService } from "app/modules/customer/RDV-history/booking.service";

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

@Injectable({
    providedIn: 'root'
})
export class BookingHistoryResolver implements Resolve<any>{
    constructor( private staffService: StaffService, private serviceService: ServiceService, private bookingService: BookingService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return forkJoin([
            this.bookingService.getHistory(1,10),
            this.serviceService.getAll(),
            this.staffService.getAll()
            
        ])    }
    
}
