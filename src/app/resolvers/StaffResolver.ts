import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { StaffService } from '../modules/admin/Management/staff/staff.service';
import { ServiceService } from '../modules/admin/Management/service/service.service';
import { forkJoin } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class StaffResolver implements Resolve<any> {
    constructor(
        private staffService: StaffService,
        private serviceService: ServiceService,
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        return forkJoin([
            this.staffService.getAll(),
            this.serviceService.getAll(),
        ]);
    }
}
