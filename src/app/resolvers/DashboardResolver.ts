import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { forkJoin } from 'rxjs';
import { DashBoardService } from 'app/modules/admin/dashboard/dashboard.service';

@Injectable({
    providedIn: 'root',
})
export class DashboardResolver implements Resolve<any> {
    constructor(
        private _dashboardService: DashBoardService,
    ) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        return forkJoin([
            this._dashboardService.getAverageWorkHour(),
            this._dashboardService.getDailyMonthlyBooking()
        ]);
    }
}

