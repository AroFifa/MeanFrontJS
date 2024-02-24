import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { WorkHourService } from '../modules/admin/Management/workhour/workHour.service';
import { StaffService } from '../modules/admin/Management/staff/staff.service';
import { forkJoin } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WorkHourResolver implements Resolve<any> {
    constructor(
        private _workHourService: WorkHourService,
        private _staffService: StaffService,
    ) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        return forkJoin([
            this._workHourService.getAll(),
            this._staffService.getAll(),
        ]);
    }
}
