import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { StaffService } from '../modules/admin/Management/staff/staff.service';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ServiceService } from '../modules/admin/Management/service.service';

import { BookingService } from "app/modules/customer/RDV-history/booking.service";

@Injectable({
    providedIn: 'root',
})
export class BookingResolver implements Resolve<any> {
    constructor(private _serviceService: ServiceService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return forkJoin([this._serviceService.getAll()]);
    }
}

@Injectable({
    providedIn: 'root'
})
export class BookingHistoryResolver implements Resolve<any>{
    constructor( private staffService: StaffService, private serviceService: ServiceService, private bookingService: BookingService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return forkJoin([
            // this.bookingService.getAll(1,10),
            [],
            this.serviceService.getAll(),
            this.staffService.getAll()
            
        ])    }
    
}
