import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { CommissionService } from 'app/modules/admin/Management/service/commission/commission.service';
import { forkJoin } from 'rxjs';
import { ServiceService } from '../modules/admin/Management/service.service';

@Injectable({
    providedIn: 'root',
})
export class ServiceResolver implements Resolve<any> {
    constructor(
        private commissionService: CommissionService,
        private serviceService: ServiceService,
    ) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return forkJoin([
            this.commissionService.get(),
            this.commissionService.getHistory(),
            this.serviceService.getAll(1, 10),
        ]);
    }
}
